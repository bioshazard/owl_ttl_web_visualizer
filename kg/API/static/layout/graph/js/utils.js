function get_truncated_content(my_str){
    let limit = 30
    return my_str.length > limit ? my_str.substring(0, limit) + '...' : my_str
}