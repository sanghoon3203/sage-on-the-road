import { useSphere } from '@react-three/drei';

export function Player() {
  // 간단한 플레이어 모델
  return (
    <mesh position={[0, -1, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  );
}