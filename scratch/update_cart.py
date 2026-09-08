import sys

with open('src/routes/index.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add handleCheckout
handle_checkout_code = """
  const handleCheckout = () => {
    if (Object.keys(cart).length === 0) return;
    
    const totalStr = Object.entries(cart).reduce((total, [id, qty]) => {
      const product = products.find(p => p.id === parseInt(id));
      return total + (product ? product.price * qty : 0);
    }, 0).toFixed(2).replace('.', ',');
    
    let text = "Olá! Gostaria de fazer o seguinte pedido:\\n\\n";
    Object.entries(cart).forEach(([id, qty]) => {
      const product = products.find(p => p.id === parseInt(id));
      if (product) {
         text += `${qty}x ${product.name} - R$ ${(product.price * qty).toFixed(2).replace('.', ',')}\\n`;
      }
    });
    text += `\\n*Total: R$ ${totalStr}*\\n\\nForma de pagamento:`;
    
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };
"""

target_insertion = "  function updateQuantity(id: number, delta: number) {"
if "const handleCheckout" not in content:
    content = content.replace(target_insertion, handle_checkout_code + '\n' + target_insertion)

# Replace the onClick
old_onclick = 'onClick={() => window.alert("Checkout nǜo implementado na demonstraǜo.")}'
old_onclick2 = 'onClick={() => window.alert("Checkout não implementado na demonstração.")}'
old_onclick3 = 'onClick={() => window.alert("Checkout n\\ufffdo implementado na demonstra\\ufffd\\ufffdo.")}'
content = content.replace(old_onclick, 'onClick={handleCheckout}')
content = content.replace(old_onclick2, 'onClick={handleCheckout}')
content = content.replace(old_onclick3, 'onClick={handleCheckout}')

# We can also just use a regex for the onclick
import re
content = re.sub(r'onClick=\{\(\) => window\.alert\([^)]+\)\}', 'onClick={handleCheckout}', content)

# Change SheetContent styles
# old: <SheetContent className="flex w-full flex-col border-border bg-surface-deep sm:max-w-md">
# new: <SheetContent style={{ backgroundColor: currentTheme.bgDark, color: currentTheme.bgLight, borderColor: currentTheme.secondaryAlpha }} className="flex w-full flex-col sm:max-w-md">
old_sheet_content = '<SheetContent className="flex w-full flex-col border-border bg-surface-deep sm:max-w-md">'
new_sheet_content = '<SheetContent style={{ backgroundColor: currentTheme.bgVeryDark, color: currentTheme.bgLight, borderColor: currentTheme.secondaryAlpha }} className="flex w-full flex-col sm:max-w-md border-l-[1px]">'
content = content.replace(old_sheet_content, new_sheet_content)

# We also need to change text-foreground inside the sheet to use the currentTheme or just current inherited color.
# Let's replace `text-foreground` in the SheetHeader and other places inside the cart with nothing, so it inherits `color: currentTheme.bgLight`
old_sheet_header = '<SheetTitle className="font-display text-2xl font-black uppercase text-foreground">Sua Sacola</SheetTitle>'
new_sheet_header = '<SheetTitle className="font-display text-2xl font-black uppercase" style={{ color: currentTheme.bgLight }}>Sua Sacola</SheetTitle>'
content = content.replace(old_sheet_header, new_sheet_header)

old_h4_prod = '<h4 className="font-display text-base font-bold uppercase leading-none text-foreground">{product.name}</h4>'
new_h4_prod = '<h4 className="font-display text-base font-bold uppercase leading-none" style={{ color: currentTheme.bgLight }}>{product.name}</h4>'
content = content.replace(old_h4_prod, new_h4_prod)

old_qty = '<span className="w-4 text-center text-xs font-bold text-foreground">{quantity}</span>'
new_qty = '<span className="w-4 text-center text-xs font-bold" style={{ color: currentTheme.bgDark }}>{quantity}</span>'
content = content.replace(old_qty, new_qty)

old_total = '<div className="mb-4 flex items-center justify-between font-display text-xl font-bold uppercase text-foreground">'
new_total = '<div className="mb-4 flex items-center justify-between font-display text-xl font-bold uppercase" style={{ color: currentTheme.bgLight }}>'
content = content.replace(old_total, new_total)

old_empty = '<h3 className="font-display text-xl font-bold uppercase text-foreground">Sua sacola est'
new_empty = '<h3 className="font-display text-xl font-bold uppercase" style={{ color: currentTheme.bgLight }}>Sua sacola est'
content = content.replace(old_empty, new_empty)

# Also fix the buttons to updateQuantity which have `text-foreground`
content = content.replace('className="size-6 rounded-sm text-foreground"', 'className="size-6 rounded-sm text-[#0B1F13]"')
# The empty cart text has `text-muted-foreground`
content = content.replace('className="mt-2 text-sm text-muted-foreground"', 'className="mt-2 text-sm opacity-70"')
# The border-border
content = content.replace('border-border', 'border-white/10')


with open('src/routes/index.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Cart")
