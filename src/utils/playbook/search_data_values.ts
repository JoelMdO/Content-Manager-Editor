export default function searchDataValues(obj: any) {
    let values: any = [];
  
    for (const key in obj) {
      const val = obj[key];
      if (typeof val === "string") {
        values.push(val);
      } else if (Array.isArray(val)) {
        for (const item of val) {
          if (typeof item === "string") {
            values.push(item);
          } else if (typeof item === "object") {
            values = values.concat(searchDataValues(item));
          }
        }
      } else if (typeof val === "object" && val !== null) {
        values = values.concat(searchDataValues(val));
      }
    }
  
    return values;
  }
  
  