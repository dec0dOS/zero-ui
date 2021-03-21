export function parseValue(
  event,
  mode = "text",
  data = null,
  key1 = null,
  key2 = null,
  id = null
) {
  let value;
  if (mode === "json") {
    value = JSON.parse(event.target.value);
  } else if (mode === "checkbox") {
    value = event.target.checked;
  } else if (mode === "arrayDel") {
    value = data[key1][key2];
    if (id) {
      value.splice(id, 1);
    }
  } else if (mode === "arrayAdd") {
    value = data[key1][key2];
    if (id) {
      value.push(id);
    }
  } else if (mode === "custom") {
    value = data;
  } else {
    value = event.target.value;
  }
  return value;
}

export function replaceValue(data, key1, key2, value) {
  if (key2) {
    data[key1][key2] = value;
  } else {
    data[key1] = value;
  }
  return data;
}

export function setValue(data, key1, key2, value) {
  if (key2) {
    data = {
      [key1]: { [key2]: value },
    };
  } else {
    data = {
      [key1]: value,
    };
  }
  return data;
}
