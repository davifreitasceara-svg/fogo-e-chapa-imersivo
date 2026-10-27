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

/**
 * Compara dois endereços para verificar se representam o mesmo local físico
 * (ignora maiúsculas/minúsculas, acentos e caracteres de pontuação).
 */
export function isSameAddress(
  a?: Partial<SavedAddress> | null,
  b?: Partial<SavedAddress> | null,
): boolean {
  if (!a || !b) return false;
  const norm = (s?: string) =>
    (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();

  const sameStreet = norm(a.address) === norm(b.address);
  const sameNumber = norm(a.number) === norm(b.number);
  const sameComp = norm(a.complement) === norm(b.complement);

  return sameStreet && sameNumber && sameComp;
}

/**
 * Remove endereços duplicados de uma lista, mantendo apenas 1 ocorrência única por endereço físico.
 */
export function deduplicateAddresses(list: SavedAddress[]): SavedAddress[] {
  if (!Array.isArray(list)) return [];
  const result: SavedAddress[] = [];
  for (const item of list) {
    if (!item || !item.address || !item.number) continue;
    const exists = result.some((r) => isSameAddress(r, item));
    if (!exists) {
      result.push(item);
    }
  }
  return result;
}

export function useUserAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getStorageKey = useCallback(() => {
    return user?.id ? `fogo_user_addresses_${user.id}` : "fogo_guest_addresses";
  }, [user?.id]);

  // Carregar endereços com garantia de deduplicação
  const loadAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      setSelectedAddressId(null);
      return;
    }

    setIsLoading(true);
    const storageKey = `fogo_user_addresses_${user.id}`;

    // 1. Carrega primeiro do cache local para resposta instantânea (deduplicado)
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached) as SavedAddress[];
        const clean = deduplicateAddresses(parsed);
        setAddresses(clean);
        if (clean.length > 0 && !selectedAddressId && clean[0]?.id) {
          setSelectedAddressId(clean[0].id);
        }
        if (clean.length !== parsed.length) {
          localStorage.setItem(storageKey, JSON.stringify(clean));
        }
      }
    } catch {
      /* ignore */
    }

    // 2. Sincroniza com o Supabase e limpa duplicatas do banco se existirem
    try {
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data && Array.isArray(data)) {
        const clean = deduplicateAddresses(data as SavedAddress[]);
        setAddresses(clean);
        localStorage.setItem(storageKey, JSON.stringify(clean));
        if (clean.length > 0 && !selectedAddressId) {
          const defaultAddr = clean.find((a: SavedAddress) => a.is_default) || clean[0];
          if (defaultAddr?.id) {
            setSelectedAddressId(defaultAddr.id);
          }
        }

        // Se o Supabase acumulou linhas duplicadas no passado, limpa as cópias excedentes do banco
        if (clean.length < data.length) {
          const keepIds = new Set(clean.map((a) => a.id));
          const toDelete = data.filter((d: any) => !keepIds.has(d.id)).map((d: any) => d.id);
          if (toDelete.length > 0) {
            supabase
              .from("user_addresses")
              .delete()
              .in("id", toDelete)
              .eq("user_id", user.id)
              .then(() => {
                console.log(`[useUserAddresses] ${toDelete.length} endereços duplicados removidos do Supabase.`);
              })
              .catch((err) => {
                console.warn("Aviso ao limpar duplicatas do Supabase:", err);
              });
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

  // Salvar novo endereço ou atualizar existente sem duplicar
  const saveAddress = async (
    data: Omit<SavedAddress, "id" | "created_at">,
  ): Promise<SavedAddress> => {
    const storageKey = getStorageKey();

    // 1. Verifica se já existe um endereço idêntico
    const existingIndex = addresses.findIndex((a) => isSameAddress(a, data));

    if (existingIndex !== -1) {
      // ENDEREÇO JÁ EXISTE: Apenas atualiza dados (título, nome, default) mantendo o ID
      const existing = addresses[existingIndex]!;
      const updatedAddress: SavedAddress = {
        ...existing,
        ...data,
        id: existing.id,
        user_id: user?.id,
      };

      const updated = deduplicateAddresses(
        addresses.map((a, i) => (i === existingIndex ? updatedAddress : a)),
      );
      setAddresses(updated);
      setSelectedAddressId(existing.id);

      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        /* ignore */
      }

      if (user?.id) {
        try {
          await supabase
            .from("user_addresses")
            .update({
              title: data.title || existing.title || "Endereço Principal",
              name: data.name,
              address: data.address,
              number: data.number,
              complement: data.complement || null,
              is_default: data.is_default ?? existing.is_default ?? true,
            })
            .eq("id", existing.id)
            .eq("user_id", user.id);
        } catch (err) {
          console.warn("Aviso ao atualizar endereço existente no Supabase:", err);
        }
      }

      return updatedAddress;
    }

    // 2. NOVO ENDEREÇO: Gera ID único e adiciona
    const newId = `addr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newAddress: SavedAddress = {
      ...data,
      id: newId,
      user_id: user?.id,
      created_at: new Date().toISOString(),
    };

    const updated = deduplicateAddresses([
      newAddress,
      ...addresses.filter((a) => !isSameAddress(a, data)),
    ]);

    setAddresses(updated);
    setSelectedAddressId(newId);

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      /* ignore */
    }

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
    const updated = deduplicateAddresses(addresses.filter((a) => a.id !== id));
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

