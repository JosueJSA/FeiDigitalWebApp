export const convertToDateTime = (miliseconds: number): Date => {
  const hours = Math.floor(miliseconds / 3600000);
  const minutes = Math.floor((miliseconds - hours * 3600000) / 60000);
  const seconds = Math.floor(
    (miliseconds - hours * 3600000 - minutes * 60000) / 1000
  );
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date;
};
