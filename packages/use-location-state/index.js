function useQueryState() {
  return [Object.fromEntries(new URLSearchParams(location.search).entries())]
}

function useLocationState() {
  return [history.state]
}

module.exports = {
  useLocationState,
  useQueryState,
}
