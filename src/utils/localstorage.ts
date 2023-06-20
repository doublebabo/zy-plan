/**
 * 是否过期
 */
const isFresh = (valObj) => {
  const now = new Date().getTime();
  return valObj.addTime + valObj.expires >= now;
};


/* 加方法 */
const extend = (s) => {
  return {
    set(key, value, expires) {
      if (['', null, void 0].includes(value)) {
        s.removeItem(key);
      } else {
        if (expires) {
          s.setItem(
            key,
            JSON.stringify({
              value,
              addTime: new Date().getTime(),
              expires,
            }),
          );
        } else {
          const val = JSON.stringify(value);
          s.setItem(key, val);
        }
      }
    },
    get(key) {
      let item = null;
      try {
        item = JSON.parse(s.getItem(key));
      } catch (error) {
      }
      // 如果有addTime的值，说明设置了失效时间
      if (item && item.addTime) {
        if (isFresh(item)) {
          return item.value;
        }
        /* 缓存过期，清除缓存，返回null */
        s.removeItem(key);
        return null;
      }
      return item;
    },
  };
};

const myLocalstorage = Object.assign({}, extend(window.localStorage));

export default myLocalstorage;