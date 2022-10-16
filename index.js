const AWS = require('aws-sdk');
const S3 = new AWS.S3();


exports.handler = async (event) => {
        
    let bucketName = 'lab-17-student';
    let key = 'images.json';
    
    let imageName = event.Records[0].s3.object.key;
    let imageSize = event.Records[0].s3.object.size;
    let parsedData = [];
    
    try {
        let bufferedData = await S3.getObject({Bucket: bucketName, Key: key}).promise();  
        console.log('|<===== BUFFERED DATA =====>|', bufferedData);
        let stringifiedData = bufferedData.Body.toString();
        parsedData = JSON.parse(stringifiedData);
        
    } catch (e) {
        console.log('Parsed data does not exist');
    }
    
    console.log('|<===== PARSED DATA =====>|', parsedData);
    
    let newImageDetails = {
        name: imageName,
        size: imageSize,
        type: 'jpg',
    };
    
    let pushIntoArray = true;
    parsedData.forEach(image => {
        if(image.name === newImageDetails.name){
            image = newImageDetails;
            pushIntoArray = false;
        }
    })
    
    if(pushIntoArray) {
        parsedData.push(newImageDetails);
    } 
    
    console.log('|<===== PARSED DATA =====>|', parsedData);
    
    const params = {
        Bucket: 'lab-17-student',
        Key: 'images.json',
        Body: JSON.stringify(parsedData),
        ContentType: 'application/json'
    };
    
    let putResponse = await S3.putObject(params).promise();
    console.log('|<===== RESPONSE =====>|', putResponse);
    
    
    const response = {
       
        statusCode: 200,
        body: JSON.stringify('Success'),
    };
    return response;
};
