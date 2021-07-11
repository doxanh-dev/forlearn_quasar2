export function validateSelected(txtValue) {
  if (
    txtValue === null ||
    txtValue === '' ||
    txtValue === undefined
  ) {
    return "Vui lòng chọn"
  } else {
    return ""
  }
}
