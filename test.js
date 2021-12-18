var sort = '-dept'
var object = {}
object[sort.substring(1)] = Math.sign(parseInt(sort.charAt(0)+"1"))
console.log(object)