import sys

path = 'c:/FORGE_INDIA_CONNECT/FIC_Official-website/frontend/src/pages/AdminDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

target = ' </motion.div>\n </AnimatePresence>'
target2 = ' </motion.div>\r\n </AnimatePresence>'

replacement = '''  {activeTab === 'atomy' && (
    <div className="animate-fade-in">
      <AtomyManager />
    </div>
  )}
 </motion.div>
 </AnimatePresence>'''

if target in c:
    c = c.replace(target, replacement)
elif target2 in c:
    c = c.replace(target2, replacement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
