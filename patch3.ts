import fs from 'fs';
let content = fs.readFileSync('src/components/ai/KnowledgeBasesManager.tsx', 'utf-8');
content = content.replace('</Table                  </Table>', '</TableBody>\n                 </Table>');
content = content.replace('Preguntar a la base</h3>base</h3>', 'Preguntar a la base</h3>');
fs.writeFileSync('src/components/ai/KnowledgeBasesManager.tsx', content);
