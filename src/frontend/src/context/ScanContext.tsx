import type { ScanResult } from "@/types";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

interface ScanContextValue {
  capturedImages: File[];
  setCapturedImages: (images: File[]) => void;
  scanResult: ScanResult | null;
  setScanResult: (result: ScanResult | null) => void;
  resetScan: () => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;
}

const ScanContext = createContext<ScanContextValue | null>(null);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [capturedImages, setCapturedImages] = useState<File[]>([]);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const resetScan = useCallback(() => {
    setCapturedImages([]);
    setScanResult(null);
    setIsAnalyzing(false);
  }, []);

  return (
    <ScanContext.Provider
      value={{
        capturedImages,
        setCapturedImages,
        scanResult,
        setScanResult,
        resetScan,
        isAnalyzing,
        setIsAnalyzing,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScanContext() {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error("useScanContext must be used within ScanProvider");
  return ctx;
}
