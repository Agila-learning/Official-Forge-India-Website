const fs = require('fs');
const file = 'c:/FORGE_INDIA_CONNECT/FIC_Official-website/fic-mobile/src/app/(drawer)/_layout.tsx';

let content = fs.readFileSync(file, 'utf8');

const candidateDrawerLink = `
function CandidateDrawerLink({ icon, label, onPress, active }: any) {
  if (active) {
    return (
      <TouchableOpacity 
        className="flex-row items-center p-4 bg-blue-600 rounded-2xl mb-2 shadow-sm shadow-blue-600/30"
        onPress={onPress}
      >
        <View className="mr-4">{React.cloneElement(icon, { color: '#ffffff' })}</View>
        <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-xs tracking-wider">{label}</Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      className="flex-row items-center p-4 rounded-2xl mb-2 active:bg-slate-50"
      onPress={onPress}
    >
      <View className="mr-4">{icon}</View>
      <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-slate-600 text-xs tracking-wider">{label}</Text>
    </TouchableOpacity>
  );
}
`;

if (!content.includes('function CandidateDrawerLink')) {
  content = content.replace("export default function DrawerLayout() {", candidateDrawerLink + "\nexport default function DrawerLayout() {");
  fs.writeFileSync(file, content);
  console.log('Appended CandidateDrawerLink');
} else {
  console.log('Already exists');
}
