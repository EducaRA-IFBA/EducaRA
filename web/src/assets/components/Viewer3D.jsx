import { Html, OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { ToolbarViewer } from "./ToolbarViewer";

function Model({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene}/>
}

export function Viewer3D({ objetoUrl }) {

    alert(objetoUrl);

    const controlsRef = useRef();

    if(!objetoUrl) return null;

    const handleZoomIn = () => {
        if (controlsRef.current) {
            const camera = controlsRef.current.object;
            if (camera) {
                camera.zoom += 0.2;
                camera.updateProjectionMatrix();
            }
        }
    };

    const handleZoomOut = () => {
        if (controlsRef.current) {
            const camera = controlsRef.current.object;
            if (camera && camera.zoom > 0.5) {
                camera.zoom -= 0.2;
                camera.updateProjectionMatrix();
            }
        }
    };

    return(
        <div className="w-full h-full bg-white rounded-xl overflow-hidden relative border border-gray-200 shadow-inner">

            <ToolbarViewer 
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
            />

            <Canvas 
                shadows 
                camera={{ position: [0, 0, 5.5], fov: 50 }}
                style={{ height: "100%", width: "100%", flex: 1 }}
            >
                <color attach="background" args={["#fff"]} />
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 10]} />
                <pointLight position={[10, 10, 10]} />

                <Suspense fallback={
                    <Html>
                        <p className="text-center p-10">Carregando modelo...</p>
                    </Html>
                }>
                    <Stage 
                        environment="city" 
                        intensity={0.6} 
                        contactShadow={{ opacity: 0.6, blur: 2 
                    }}>
                        <Model url={objetoUrl} />
                    </Stage>
                </Suspense>

                <OrbitControls 
                    ref={controlsRef} 
                    makeDefault 
                    minDistance={1}
                    maxDistance={10}
                />
            </Canvas>
        </div>
        
        
    );
}
