module.exports = {
    format_date: (date) => {
      return `${date.getMonth() + 1}/${date.getDate()}/${
        new Date(date).getFullYear() + 5
      }`;
    }
  };