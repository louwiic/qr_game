import AsyncStorage from "@react-native-async-storage/async-storage";

export const store = async (key, value) => {
      try {
            return await AsyncStorage.setItem(key, value);
      } catch (e) {
            return null;
      }
};

export const pushArray = async (key, obj) => {
      let states = await getArray(key);
      if (!states) {
            await store(key, []);
            states = await get(key);
      }
      let find = states.find((f) => {
            return f.id === obj.id;
      });
      if (find) {
            states = states.map((f) => {
                  if (f.id === obj.id) {
                        f = obj;
                  }
                  return f;
            });
      } else {
            states.push(obj);
      }
      await store(key, JSON.stringify(states));
};

export const removeInArray = async (key, obj) => {
      let states = await getArray(key);
      states = states.filter((f) => {
            return f.id !== obj.id;
      });

      await store(key, JSON.stringify(states));
};

export const getArray = async (key) => {
      let array = await get(key);
      try {
            if (array) {
                  array = JSON.parse(array);
            }
      } catch (error) {
            array = [];
      }
      return array || [];
};

export const get = async (key) => {
      try {
            const value = await AsyncStorage.getItem(key);
            return value;
      } catch (e) {
            return null;
      }
};