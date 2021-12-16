import { pull } from "lodash";

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
    if (id !== null) {
      value.splice(id, 1);
    }
  } else if (mode === "arrayAdd") {
    value = data[key1][key2];
    if (id) {
      value.push(id);
    }
  } else if (mode === "custom") {
    value = data;
  } else if (mode === "capChange") {
    value = data[key1][key2];
    if (event.target.checked) {
      value.push(id);
    } else {
      pull(value, id);
    }
  } else if (mode === "tagChange") {
    value = data[key1][key2];
    let tagValue = event.target.value;
    let tagIndex = value.findIndex((item) => {
      return item[0] === id;
    });
    if (tagIndex !== -1) {
      value.splice(tagIndex, 1);
    }
    if (tagValue !== "") {
      value.push([id, tagValue]);
    }
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
