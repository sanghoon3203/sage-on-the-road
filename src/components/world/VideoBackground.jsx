// src/components/world/VideoBackground.jsx

import React, { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';   
import * as THREE from 'three';

export function VideoBackground({ videoPath }) {
  const { scene } = useThree(); // 씬 객체에 직접 접근하기 위해 useThree 훅 사용
  const [video, setVideo] = useState(() => {
    const vid = document.createElement("video");
    vid.src = videoPath;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true; // 자동 재생을 위해 음소거는 필수입니다.
    vid.play();
    return vid;
  });

  useEffect(() => {
    // VideoTexture를 생성하고, 이 텍스처를 씬의 배경으로 설정합니다.
    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace; // 올바른 색상 표현을 위해 중요
    
    // 이 텍스처를 씬의 배경으로 직접 할당합니다.
    // 이렇게 하면 카메라 위치와 상관없이 항상 화면을 꽉 채우는 배경이 됩니다.
    scene.background = texture;

    // 컴포넌트가 사라질 때 정리 함수
    return () => {
      scene.background = null; // 씬 배경을 원래대로
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [video, scene]);

  // 이 컴포넌트는 실제 3D 객체를 렌더링하지 않으므로 null을 반환합니다.
  // 모든 작업은 useEffect 안에서 scene 객체를 직접 조작하여 이루어집니다.
  return null;
}