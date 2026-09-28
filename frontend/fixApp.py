import sys

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "const RideHistoryPage =" in line:
        lines.insert(i + 1, "const MembershipHub = lazy(() => import('./pages/MembershipHub'));\n")
        break

for i, line in enumerate(lines):
    if "path=\"/agent-network\"" in line:
        lines.insert(i + 1, " <Route path=\"/membership\" element={<MembershipHub />} />\n")
        break

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
