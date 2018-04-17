type Constructable<T> = {
    new (...args: any[]): T;
};

interface LifecycleListener {
    onCreate?(component: any): void;
}

declare class TSDI {
    public addLifecycleListener(lifecycleListener: LifecycleListener): void;
    public addProperty(key: string, value: any): void;
    public close(): void;
    public enableComponentScanner(): void;
    public enableAutomock(...allowedDependencies: any[]): void;
    public register(component: Constructable<any>, name?: string): void;
    public configureExternal<T>(args: any[], target: any): T;
    public get<T>(componentOrHint: string | Constructable<T>): T;
    public get<T>(component: Constructable<T>, hint: string): T;
}

declare var tsdi: TSDI;
