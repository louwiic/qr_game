import {BaseURL} from '../../contexts/ApiContext';

export const urlImage = e => {
  if (e) {
    const isUrl = e && typeof e === 'string' && e?.split('http')[1];
    const url = isUrl ? e : `${BaseURL}${e || ''}`;
    return url;
  } else {
    return null;
  }
};
