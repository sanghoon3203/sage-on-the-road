import { useBox } from '@react-three/drei';
import useGameStore from '../../store/useGameStore';

export function NpcCharacter({ npcData }) {
  const startEncounter = useGameStore(state => state.startEncounter);
  const gameState = useGameStore(state => state.gameState);
  
  const handleClick = () => {
    if(gameState === 'walking') {
      startEncounter(npcData);
    }
  }

  return (
    <mesh position={npcData.position} onClick={handleClick}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="lightcoral" />
    </mesh>
  );
}