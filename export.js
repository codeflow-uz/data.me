var fs = require('fs');

function export2xls(jsn, json) {
    var data = "Tr \t Id \t F.I.Sh \t Tug'ilgan kuni \t Passport \t Fuqaroligi \n";
    for (var i = 0; i < jsn.length; i++) {
        data = data + parseInt(i+1) + '\t' + jsn[i].id + '\t' + jsn[i].fullname + '\t' + jsn[i].birthday + '\t' + jsn[i].passport + '\t' + jsn[i].nationality + '\n';
    }
    fs.writeFileSync('Shaxs.xls', data, (err) => {
        if (err) throw err;
    });

    var data_c = "Tr \t Id \t Kompaniya nomi \t Sanasi \t Haqida \t Mamlakati \n";
    for (var i = 0; i < json.length; i++) {
        data_c = data_c + parseInt(i+1) + '\t' + json[i].id + '\t' + json[i].name + '\t' + json[i].date + '\t' + json[i].about + '\t' + json[i].country + '\n';
    }
    fs.writeFileSync('Kompaniya.xls', data_c, (err) => {
        if (err) throw err;
    });
}

module.exports = export2xls