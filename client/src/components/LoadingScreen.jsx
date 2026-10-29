
import React from "react";
import { LoaderCircle, Plane } from "lucide-react";

function LoadingScreen() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#080b14] text-white gap-5">
            <div className="relative flex items-center justify-center">
                <div className="absolute h-20 w-20 rounded-full border-2 border-blue-500/20" />

                <LoaderCircle
                    size={64}
                    className="animate-spin text-blue-500"
                />

                <Plane
                    size={24}
                    className="absolute text-cyan-400"
                />
            </div>

            <div className="text-center">
                <h2 className="text-lg font-semibold tracking-wider">
                    WANDER AI
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                    Restoring your session...
                </p>
            </div>
        </div>
    );
}

export default LoadingScreen;
