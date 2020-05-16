let fs = require('fs');

module.exports = {
    executeCommand(query, response) {
        response.writeHead(200, {
            'Content-Type' : 'text/html'
        });

        var mode = query.mode;

        if(mode === 'addflat') {
            var floor = query.floor;
            var door = query.door;
            var area = query.area;
            var space = query.space;

            var obj = {
                flats: []
             };
            fs.readFile('flatsdata.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                obj = JSON.parse(data);
                obj.flats.push({
                    Floor: floor,
                    Door: door, 
                    Area: area,
                    Space: space
                });
                json = JSON.stringify(obj);
                fs.writeFile('flatsdata.json', json, 'utf8', function(err){
                    if(err){ 
                          console.log(err);
                    }
                });
            }});
            response.end();
        }
        else if(mode === 'listflats') {
            var obj = [];
            fs.readFile('flatsdata.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                obj = JSON.parse(data);
                console.log(obj);
                console.log(obj.flats.length);

                var htmltext;
                htmltext += "<table border='1' style=\"min-width: 200px;\">"
                for (i = 0; i <= obj.flats.length - 1; i++) {
                    htmltext += "<tr><td>" + obj.flats[i].Floor + '/' + obj.flats[i].Door + ' ' + obj.flats[i].Area + 'm^2 ' + obj.flats[i].Space + 'm^3 ' + "</td></tr>";
                }
                htmltext += "</table>"
                response.write(htmltext);
                response.end();
            
                }
            });
        }
        else if(mode === 'addresident') {
            var name = query.name;
            var balance = query.balance;
            var floor = query.floor;
            var door = query.door;

            var area;

            var flatsobj = {
                flats: []
            }
            fs.readFile('flatsdata.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                    flatsobj = JSON.parse(data);

                    var success = false;
                    for (i = 0; i <= flatsobj.flats.length - 1; i++) {
                        if(flatsobj.flats[i].Floor === floor && flatsobj.flats[i].Door === door) {
                            success = true;
                            area = parseInt(flatsobj.flats[i].Area);
                            console.log('Raw: ' + flatsobj.flats[i].Area);
                            console.log('RawParsed: ' + parseInt(flatsobj.flats[i].Area));
                            console.log('Parsed: ' + area);
                            break;
                        }
                    }

                    if(success === true)
                    {
                        var debit = area * 500;
                        console.log('Debit: ' + debit);
                        var obj = {
                            residents: []
                        };
                        fs.readFile('residentsdata.json', 'utf8', function readFileCallback(err, data){
                            if (err){
                                console.log(err);
                            } else {
                            obj = JSON.parse(data);
                            obj.residents.push({
                                Name: name,
                                Balance: balance,
                                Floor: floor,
                                Door: door,
                                Debit: debit
                            });
                            json = JSON.stringify(obj);
                            fs.writeFile('residentsdata.json', json, 'utf8', function(err){
                                if(err){ 
                          console.log(err);
                    }
                });
            }});
            response.end();
                    }
                }
            });
        }
        else if(mode === 'removeresident') {
            var floor = query.floor;
            var door = query.door;

            var success = false;
            var obj = {
                residents: []
             };
            fs.readFile('residentsdata.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                obj = JSON.parse(data);
                
                
                for (i = 0; i <= obj.residents.length - 1; i++) {
                    if(obj.residents[i].Floor === floor && obj.residents[i].Door === door) {
                        obj.residents[i].Floor = '-';
                        obj.residents[i].Door = '-';
                        success = true;
                        break;
                    }
                }

                json = JSON.stringify(obj);
                fs.writeFile('residentsdata.json', json, 'utf8', function(err){
                    if(err){ 
                          console.log(err);
                    }
                });
            }});
            response.end();
        }
        else if (mode === 'listresidents') {
            var obj = [];
            fs.readFile('residentsdata.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                obj = JSON.parse(data);
                console.log(obj);

                var htmltext;
                htmltext += "<table border='1' style=\"min-width: 200px;\">"
                for (i = 0; i <= obj.residents.length - 1; i++) {
                    htmltext += "<tr><td>" + obj.residents[i].Name + ' ' + obj.residents[i].Balance + 'Ft ' + '(' + obj.residents[i].Debit + 'Ft) ' + obj.residents[i].Floor + '/' + obj.residents[i].Door + "</td></tr>";
                }
                htmltext += "</table>"
                response.write(htmltext);
                response.end();
            
                }
            });
        }
        else if (mode === 'paydebit') {
            var name = query.name;
            var amount = query.amount;
            var details = query.details;

            var obj = [];
            fs.readFile('residentsdata.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                    obj = JSON.parse(data);
                    console.log(obj);

                    for (i = 0; i <= obj.residents.length - 1; i++) {
                        if(obj.residents[i].Name === name) {

                            var newBalance = parseInt(obj.residents[i].Balance) - amount;
                            var newDebit = parseInt(obj.residents[i].Debit) - amount;
                            obj.residents[i].Balance = newBalance;
                            obj.residents[i].Debit = newDebit;

                            json = JSON.stringify(obj);
                            fs.writeFile('residentsdata.json', json, 'utf8', function(err){
                                if(err){ 
                                console.log(err);
                                }
                            });

                            var transactionobj = [];
                            fs.readFile('transactionsdata.json', 'utf8', function readFileCallback(err, transactiondata){
                                if (err){
                                    console.log(err);
                                } else {
                                    transactionobj = JSON.parse(transactiondata);
                                    transactionobj.transactions.push({
                                        Name: name,
                                        Details: details,
                                        Amount: amount,
                                        
                                        Date: Date()
                                    });
                                    
                                    json = JSON.stringify(transactionobj);
                                    fs.writeFile('transactionsdata.json', json, 'utf8', function(err){
                                        if(err){ 
                                    console.log(err);
                                        }
                                    });
                                }
                            });

                            response.end();
                            return;
                        }
                    }
            
                }
            });
        }
        else if (mode === 'adddebit') {
            var name = query.name;
            var amount = query.amount;
            var details = query.details;

            var obj = [];
            fs.readFile('residentsdata.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                    obj = JSON.parse(data);
                    console.log(obj);

                    for (i = 0; i <= obj.residents.length - 1; i++) {
                        if(obj.residents[i].Name === name) {

                            var newDebit = parseInt(obj.residents[i].Debit) - -amount;
                            obj.residents[i].Debit = newDebit;

                            json = JSON.stringify(obj);
                            fs.writeFile('residentsdata.json', json, 'utf8', function(err){
                                if(err){ 
                                console.log(err);
                                }
                            });

                            var transactionobj = [];
                            fs.readFile('transactionsdata.json', 'utf8', function readFileCallback(err, transactiondata){
                                if (err){
                                    console.log(err);
                                } else {
                                    transactionobj = JSON.parse(transactiondata);
                                    transactionobj.transactions.push({
                                        Name: name,
                                        Details: details,
                                        Amount: amount,

                                        Date: Date()
                                    });
                                    
                                    json = JSON.stringify(transactionobj);
                                    fs.writeFile('transactionsdata.json', json, 'utf8', function(err){
                                        if(err){ 
                                    console.log(err);
                                        }
                                    });
                                }
                            });

                            response.end();
                            return;
                        }
                    }
                    response.end();
                }
            });
        }
        else if(mode === 'listtransactions') {
            var obj = [];
            fs.readFile('transactionsdata.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                obj = JSON.parse(data);
                console.log(obj);

                var htmltext;
                htmltext += "<table border='1' style=\"min-width: 200px;\">"
                for (i = 0; i <= obj.transactions.length - 1; i++) {
                    htmltext += "<tr><td>" + obj.transactions[i].Name + ' ' + obj.transactions[i].Details + '  ' + obj.transactions[i].Amount + 'Ft ' + obj.transactions[i].Date + "</td></tr>";
                }
                htmltext += "</table>"
                response.write(htmltext);
                response.end();
            
                }
            });
        }
    }
}