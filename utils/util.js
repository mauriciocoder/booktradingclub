exports.setBooksPosition = function(books) {
    // Did not find a better way to control index conditionals!! :(
    for (var i = 0; i < books.length; i++) {
        if (i == 0 || books[i - 1]["endRow"]) {
            books[i]["startsRow"] = true;
        }
        if ((i + 1) % 3 == 0) {
            books[i]["endRow"] = true;
        }
        if (i == books.length - 1) {
            books[i]["endRow"] = true;
        }
    }
}

exports.truncateDescription = function(books) {
    for (var i = 0; i < books.length; i++) {
        var description = books[i]["description"];
        books[i]["description"] = description.substring(0, 200) + "...";
    }
}
