
class PublicMethod {

    parseIdtoInt(id) {
        return parseInt(id.match(/\d+$/)[0], 10);;
    }

}

export default new PublicMethod;