import PropTypes from 'prop-types';
import {
    Card,
    CardBody,
    CardFooter,
    Button,
    Image,
    Stack,
    Text,
    Heading,
    useToast,
} from '@chakra-ui/react';
import { thousandSeparator } from '../utils/helper';

const MenuCard = ({ item, addItem }) => {
    const toast = useToast()

    return (
        <Card maxW='sm'>
            <CardBody>
                <Image
                    src={item.gambar}
                    borderRadius="md"
                    objectFit="contain"
                    objectPosition="center"
                    w="full"
                    h="44"
                />
                <Stack mt='6' spacing='3'>
                    <Heading size='md'>
                        {item.nama}
                    </Heading>
                    <Text fontSize='md' fontWeight="semibold" color="teal.300">
                        Rp {thousandSeparator(item.harga)}
                    </Text>
                </Stack>
            </CardBody>
            <CardFooter>
                <Button
                    w="full"
                    colorScheme="teal"
                    onClick={() => {
                        addItem({ ...item, qty: 1, catatan: '' })
                        toast({
                            title: `${item.nama} ditambahkan ke keranjang`,
                            status: 'info',
                            duration: 5000,
                            isClosable: true,
                        })
                    }}
                >
                    Tambahkan ke Keranjang
                </Button>
            </CardFooter>
        </Card>
    );
};

MenuCard.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number,
        nama: PropTypes.string,
        tipe: PropTypes.string,
        gambar: PropTypes.string,
        harga: PropTypes.number,
    }),
    addItem: PropTypes.func,
}

export default MenuCard;