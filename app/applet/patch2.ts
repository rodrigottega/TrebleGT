import fs from 'fs';
let content = fs.readFileSync('src/components/ai/AgentsView.tsx', 'utf-8');
content = content.replace(
  '<SelectItem value="activo">Activo</SelectItem>\n                                    <SelectItem value="pausado">Pausado</SelectItem>\n                                    <SelectItem value="borrador">Borrador</SelectItem>',
  '<SelectItem value="Activo">Activo</SelectItem>\n                                    <SelectItem value="Pausado">Pausado</SelectItem>\n                                    <SelectItem value="Borrador">Borrador</SelectItem>'
);
fs.writeFileSync('src/components/ai/AgentsView.tsx', content);
