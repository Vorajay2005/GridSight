// Quick test to check if all components exist
const fs = require('fs');
const path = require('path');

const componentsDir = '/Users/jayvora/Desktop/GridSight/frontend/src/components';
const components = ['Hero.jsx', 'SearchPanel.jsx', 'MapView.jsx', 'ResultsPanel.jsx', 'SiteDetailModal.jsx', 'AgentStatus.jsx'];

console.log('Checking components...\n');

components.forEach(comp => {
  const filePath = path.join(componentsDir, comp);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const hasExport = content.includes('export default') || content.includes('export {');
    console.log(`✅ ${comp}: ${stats.size} bytes, has export: ${hasExport}`);
  } else {
    console.log(`❌ ${comp}: NOT FOUND`);
  }
});

console.log('\nChecking main files...\n');
['src/main.jsx', 'src/App.jsx', 'src/index.css'].forEach(file => {
  const filePath = `/Users/jayvora/Desktop/GridSight/frontend/${file}`;
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file}: ${stats.size} bytes`);
  } else {
    console.log(`❌ ${file}: NOT FOUND`);
  }
});
