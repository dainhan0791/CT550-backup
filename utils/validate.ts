export const removeAccents = (str: string) => {
  if (str) {
    return removeSpaceText(
      str
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D'),
    );
  }
};

export const removeSpaceText = (str: string) => {
  if (str) {
    return str.split(' ').join('');
  }
};
