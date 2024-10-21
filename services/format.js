function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; 
  } 




  function formatPrice(price) {
    const [integerPart, decimalPart] = price.toString().split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const formattedPrice = decimalPart
      ? `${formattedInteger},${decimalPart}`
      : formattedInteger;
    return `${formattedPrice}đ`;
  }



  function formatCurrency(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }


  const generateUserId = async (rolePrefix, table, id) => {
    const query = `SELECT MAX(CAST(SUBSTRING(${id}, LENGTH('${rolePrefix}') + 1) AS UNSIGNED)) AS maxId FROM ${table} WHERE ${id} LIKE '${rolePrefix}%'`;
    const [results] = await db.query(query);
    const maxId = results[0].maxId || 0;
    const newId = maxId + 1;
    return `${rolePrefix}${String(newId).padStart(4, "0")}`;
  };



  function shiftToNumber(shift) {
    switch(shift) {
      case '7h-9h': return 1;
      case '9h-11h': return 2;
      case '13h-15h': return 3;
      case '15h-17h': return 4;
      default: return 5; // Để xử lý các trường hợp không mong muốn
    }
  }



  const getDaysOfWeek = (offset) => {
    const startOfWeek = new Date();
    startOfWeek.setDate(
      startOfWeek.getDate() - startOfWeek.getDay() + 1 + offset * 7
    ); 


  module.exports = { formatDate, formatPrice , formatCurrency , generateUserId,shiftToNumber,getDaysOfWeek};



