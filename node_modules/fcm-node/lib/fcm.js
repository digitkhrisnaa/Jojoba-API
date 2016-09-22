var util = require('util');
var https = require('https');
var querystring = require('querystring');
var retry = require('retry');

function FCM(serverKey) {

    if (serverKey)
    {
        this.serverKey = serverKey;
    }
    else
    {
        throw Error('You must provide the APIKEY for your firebase application.');
    }

    this.fcmOptions = {
        host: 'fcm.googleapis.com',
        port: 443,
        path: '/fcm/send',
        method: 'POST',
        headers: {}
    };    

    this.send = function(payload, CB) {

        var self = this;
        if (!CB) {
            throw Error('you must provide a callback function(err,result)'); //just in case
        }
        else {
            var operation = retry.operation();
            var mpayload = JSON.stringify(payload);
            var mFcmOptions = JSON.parse(JSON.stringify(self.fcmOptions)) //copying the fcmOptions object to avoid problems in parallel calls

            operation.attempt(function (currentAttempt) {
                var headers = {
                    'Host': mFcmOptions.host,
                    'Authorization': 'key=' + self.serverKey,
                    'Content-Type': 'application/json'
                    //'Content-Length': mpayload.length //removed this line for chunk-encoded transfer compatibility (UTF-8 and all non-ANSI codification)
                };

                mFcmOptions.headers = headers;

                if (self.keepAlive) headers.Connection = 'keep-alive';

                var request = https.request(mFcmOptions, function (res) {
                    var data = '';


                    if (res.statusCode == 503) {
                        // If the server is temporary unavailable, the C2DM spec requires that we implement exponential backoff
                        // and respect any Retry-After header
                        if (res.headers['retry-after']) {
                            var retrySeconds = res.headers['retry-after'] * 1; // force number
                            if (isNaN(retrySeconds)) {
                                // The Retry-After header is a HTTP-date, try to parse it
                                retrySeconds = new Date(res.headers['retry-after']).getTime() - new Date().getTime();
                            }
                            if (!isNaN(retrySeconds) && retrySeconds > 0) {
                                operation._timeouts['minTimeout'] = retrySeconds;
                            }
                        }
                        if (!operation.retry('TemporaryUnavailable')) {
                            CB(operation.mainError(), null);
                        }
                        // Ignore all subsequent events for this request
                        return;
                    }

                    function respond() {
                        var error = null, id = null;

                        //Handle the various responses
                        if (data.indexOf('\"multicast_id\":') > -1)//multicast_id success
                        {
                            anyFail = ((JSON.parse(data)).failure > 0);

                            if (anyFail) {
                                error = data.substring(0).trim();
                            }

                            anySuccess = ((JSON.parse(data)).success > 0);

                            if (anySuccess) {
                                id = data.substring(0).trim();
                            }
                        } else if (data.indexOf('\"message_id\":') > -1) {  //topic messages success
                            id = data;
                        } else if (data.indexOf('\"error\":') > -1) { //topic messages error
                            error = data;
                        } else if (data.indexOf('TopicsMessageRateExceeded') > -1) {
                            error = 'TopicsMessageRateExceededError'
                        } else if (data.indexOf('Unauthorized') > -1) {
                            error = 'NotAuthorizedError'
                        } else {
                            error = 'InvalidServerResponse';
                        }
                        // Only retry if error is QuotaExceeded or DeviceQuotaExceeded
                        if (operation.retry(currentAttempt <= 3 && ['QuotaExceeded', 'DeviceQuotaExceeded', 'InvalidServerResponse'].indexOf(error) >= 0 ? error : null)) {
                            return;
                        }
                        // Success, return message id (without id=)
                        CB(error, id);
                    }

                    res.on('data', function (chunk) {
                        data += chunk;
                    });
                    res.on('end', respond);
                    res.on('close', respond);
                });

                request.on('error', function (error) {
                    CB(error, null);
                });

                request.end(mpayload);
            });
        }
    }
}
module.exports = FCM;

