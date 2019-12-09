export const getDisplayName = WrappedComponent => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component"
}

export const makeOneToOneRoomId = (idA, idB) => {
  if (idB > idA) {
    const temp = idA
    idA = idB
    idB = temp
  }
  return `${btoa(idA)}-${btoa(idB)}`
}
