import { useState, useEffect, useCallback, useRef } from "react";
import { WebContainer } from "@webcontainer/api"
import { TemplateFolder } from "@/modules/playground/lib/path-to-json";

// Module-scoped singleton guards to ensure only one WebContainer is booted
let __webcontainerInstance: WebContainer | null = null
let __webcontainerBootPromise: Promise<WebContainer> | null = null

async function getOrBootWebContainer(): Promise<WebContainer> {
    if (__webcontainerInstance) {
        return __webcontainerInstance
    }
    if (__webcontainerBootPromise) {
        return __webcontainerBootPromise
    }
    __webcontainerBootPromise = WebContainer.boot()
        .then((inst) => {
            __webcontainerInstance = inst
            return inst
        })
        .catch((err) => {
            // Reset the promise so future calls can retry
            __webcontainerBootPromise = null
            throw err
        })
    return __webcontainerBootPromise
}

function clearWebContainerSingleton() {
    __webcontainerInstance = null
    __webcontainerBootPromise = null
}


interface UseWebContainerProps {
    templateData: TemplateFolder
}

interface UseWebContainerReturn {
    serverUrl: string | null;
    isLoading: boolean | null;
    error: string | null;
    instance: WebContainer | null;
    writeFileSync: (path: string, content: string) => Promise<void>;
    destroy: () => void
}

export const useWebContainer = ({ templateData }: UseWebContainerProps): UseWebContainerReturn => {
    const [serverUrl, setServerUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [instance, setInstance] = useState<WebContainer | null>(null);
    const instanceRef = useRef<WebContainer | null>(null)

    useEffect(() => {
        let mounted = true

        async function initializeWebContainer() {
            try {
                const webcontainerInstance = await getOrBootWebContainer()
                if (!mounted) return
                setInstance(webcontainerInstance)
                instanceRef.current = webcontainerInstance
                setIsLoading(false)
            } catch (err) {
                console.error('Failed to initialize WebContainer:', err);
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Failed to initialize WebContainer');
                    setIsLoading(false);
                }
            }
        }
        initializeWebContainer()
        return () => {
            mounted = false
            // Do not auto-teardown the singleton here; use destroy() explicitly when needed.
        }
    }, [])

    const writeFileSync = useCallback(async (path: string, content: string): Promise<void> => {
        if (!instance) {
            throw new Error('WebContainer instance is not available');
        }

        try {
            const pathParts = path.split("/")
            const folderPath = pathParts.slice(0, -1).join("/")
            if (folderPath) {
                await instance.fs.mkdir(folderPath, { recursive: true }); // Create folder structure recursively
            }
            await instance.fs.writeFile(path, content)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to write file';
            console.error(`Failed to write file at ${path}:`, err);
            throw new Error(`Failed to write file at ${path}: ${errorMessage}`);
        }
    }, [instance])

    const destroy = useCallback(() => {
        const target = instanceRef.current
        if (target) {
            target.teardown();
            instanceRef.current = null
            setInstance(null);
            setServerUrl(null);
            clearWebContainerSingleton()
        }
    }, [])
    return { serverUrl, isLoading, error, instance, writeFileSync, destroy };
}

