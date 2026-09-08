import re

with open('src/routes/index.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the products array
prod_match = re.search(r'const products: Product\[\] = \[\n(.*?)\];', content, re.DOTALL)
products_str = prod_match.group(1)

# Find all menu items
sections = re.findall(r'\{\s*name:\s*"(.*?)",\s*price:\s*"(.*?)"(.*?)\}', content)

new_products = []
new_id = 301
for name, price, extra in sections:
    price_val = float(price.replace(',', '.'))
    new_products.append(f'  {{ id: {new_id}, name: "{name}", description: "{name}", price: {price_val}, image: burgerClassico, category: "burger" }},')
    
    # We also need to replace the occurrence in the file to include the ID
    original_str = f'{{ name: "{name}", price: "{price}"{extra} }}'
    new_str = f'{{ id: {new_id}, name: "{name}", price: "{price}"{extra} }}'
    content = content.replace(original_str, new_str)
    new_id += 1

# Now add new_products to the products array
updated_products_str = products_str + '\n  // Text Menu Items\n' + '\n'.join(new_products) + '\n'
content = content.replace(products_str, updated_products_str)

# Now update the map function to add the button
target_span = '<span className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right">R$ {item.price}</span>'
replacement_btn = '<button onClick={() => addToCart((item as any).id)} className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:bg-amber-100 hover:scale-105 transition-all flex items-center gap-1 cursor-pointer">R$ {item.price} <Plus className="size-3"/></button>'

content = content.replace(target_span, replacement_btn)

with open('src/routes/index.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Added {len(new_products)} products.')
