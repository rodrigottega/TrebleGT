import fs from 'fs';
let content = fs.readFileSync('src/components/ai/AgentsView.tsx', 'utf-8');
content = content.replace(
  /<SelectItem value="activo">Activo<\/SelectItem>/g,
  '<SelectItem value="Activo">Activo</SelectItem>'
);
content = content.replace(
  /<SelectItem value="pausado">Pausado<\/SelectItem>/g,
  '<SelectItem value="Pausado">Pausado</SelectItem>'
);
content = content.replace(
  /<SelectItem value="borrador">Borrador<\/SelectItem>/g,
  '<SelectItem value="Borrador">Borrador</SelectItem>'
);
fs.writeFileSync('src/components/ai/AgentsView.tsx', content);
