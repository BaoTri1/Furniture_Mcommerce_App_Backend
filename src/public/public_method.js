
class PublicMethod {

    parseIdtoInt(id) {
        return parseInt(id.match(/\d+$/)[0], 10);;
    }

    generateRandomString(){
        // Các ký tự có thể xuất hiện trong chuỗi
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
        // Độ dài mong muốn của chuỗi
        const length = 5;
    
        let randomString = '';
    
        // Tạo chuỗi ngẫu nhiên bằng cách chọn ngẫu nhiên ký tự từ danh sách
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }
    
        return randomString;
    }
    
    formatDate() {
        var dateObject = new Date();
    
        var day = dateObject.getDate();
        var month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
        var year = dateObject.getFullYear();
    
        return `${year}${month}${day}`
    
    }
    

}

export default new PublicMethod;