export default ({graphQLErrors}: any, {error}: any) => {
    error(graphQLErrors[0])
}
