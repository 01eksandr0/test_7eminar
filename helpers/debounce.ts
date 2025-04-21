export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function(this: any, ...args: Parameters<T>) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};   
        