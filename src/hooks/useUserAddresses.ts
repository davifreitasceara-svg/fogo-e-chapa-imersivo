import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SavedAddress {
  id: string;
  user_id?: string | undefined;
  title: string;
  name: string;
  address: string;
  number: string;
  complement?: string | undefined;
  is_default?: boolean | undefined;
  created_at?: string | undefined;
}

export function useUserAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getStorageKey = useCallback(() => {
    return user?.id ? `fogo_user_addresses_${user.id}` : "fogo_guest_addresses";
  }, [user?.id]);

  // Carregar endereços
  const loadAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      setSelectedAddressId(null);
      return;
    }

    setIsLoading(true);
    const storageKey = `fogo_user_addresses_${user.id}`;

    // 1. Carrega primeiro do cache local para resposta instantânea
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached) as SavedAddress[];
        setAddresses(parsed);
        if (parsed.length > 0 && !selectedAddressId && parsed[0]?.id) {
          setSelectedAddressId(parsed[0].id);
        }
      }
    } catch {
      /* ignore */
    }

    // 2. Tenta sincronizar com o Supabase
    try {
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data && Array.isArray(data)) {
        setAddresses(data);
        localStorage.setItem(storageKey, JSON.stringify(data));
        if (data.length > 0 && !selectedAddressId) {
          const defaultAddr = data.find((a: SavedAddress) => a.is_default) || data[0];
          if (defaultAddr?.id) {
            setSelectedAddressId(defaultAddr.id);
          }
        }
      }
    } catch (err) {
      console.warn("Tabela user_addresses no Supabase ainda não inicializada ou offline. Usando cache local.", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedAddressId]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // Salvar novo endereço ou atualizar existente
  const saveAddress = async (
    data: Omit<SavedAddress, "id" | "created_at">,
  ): Promise<SavedAddress> => {
    const storageKey = getStorageKey();
    const newId = `addr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newAddress: SavedAddress = {
      ...data,
      id: newId,
      user_id: user?.id,
      created_at: new Date().toISOString(),
    };

    // 1. Atualizar imediatamente o estado e local storage
    const updated = [newAddress, ...addresses.filter((a) => a.address !== data.address || a.number !== data.number)];
    setAddresses(updated);
    setSelectedAddressId(newId);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      /* ignore */
    }

    // 2. Se o usuário estiver logado, persiste no Supabase
    if (user?.id) {
      try {
        await supabase.from("user_addresses").insert({
          id: newId,
          user_id: user.id,
          title: data.title || "Endereço Principal",
          name: data.name,
          address: data.address,
          number: data.number,
          complement: data.complement || null,
          is_default: data.is_default ?? true,
        });
      } catch (err) {
        console.warn("Aviso: endereço salvo localmente com sucesso (Supabase sync opcional):", err);
      }
    }

    toast.success("Endereço salvo com sucesso para seus pedidos! 📍");
    return newAddress;
  };

  // Remover endereço
  const deleteAddress = async (id: string) => {
    const storageKey = getStorageKey();
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    if (selectedAddressId === id) {
      setSelectedAddressId(updated[0]?.id || null);
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      /* ignore */
    }

    if (user?.id) {
      try {
        await supabase.from("user_addresses").delete().eq("id", id).eq("user_id", user.id);
      } catch {
        /* ignore */
      }
    }

    toast.info("Endereço removido.");
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || null;

  return {
    addresses,
    selectedAddress,
    selectedAddressId,
    setSelectedAddressId,
    saveAddress,
    deleteAddress,
    isLoading,
    refreshAddresses: loadAddresses,
  };
}
