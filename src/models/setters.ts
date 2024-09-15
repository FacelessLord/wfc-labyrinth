export const createSetter = <T extends Object>(initialModel: T, modelSetter: (model: T) => void): Setters<T> => {
    const setters = {} as Setters<T>;
    for (const key in initialModel) {
        // @ts-ignore
        setters[`set${capitalize(key)}`] = (model: T, value: T[typeof key]) => modelSetter(Object.assign({}, model, {[key]: value}) as T);
    }

    return setters;
}

const capitalize = <T extends string>(s: T) => (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<T>;

type Setters<T> = { [key in Extract<keyof T, string> as `set${Capitalize<key & string>}`]: (model: T, value: T[key]) => T };