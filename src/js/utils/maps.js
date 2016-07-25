export default function map() {
    try {
        throw new Error('Map exception');
    } catch (error) {
        console.log(error);
    }
}
