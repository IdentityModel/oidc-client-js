function assert(test, msg){
    if (!test){
        var err = new Error(msg||test);
        throw err;
    }
}

function fail(e){
    if (e instanceof Error){
        throw e;
    }
    throw new Error(e);
}
