import { useRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Card, Divider,
    Image, Button,
    CardBody, Flex,
    Heading, Text,
    Input, Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useToast,
} from '@chakra-ui/react';
import { DeleteIcon, MinusIcon, AddIcon } from '@chakra-ui/icons';
import { thousandSeparator, BASE_URL } from '../utils/helper';

const Sidebar = (props) => {
    const {
        isOpen,
        onClose,
        keranjang,
        addItem,
        decreaseQty,
        removeItem,
        updateItem,
    } = props

    const btnRef = useRef()
    const toast = useToast()
    const [voucher, setVoucher] = useState('')
    const [discount, setDiscount] = useState(0)
    const [loading, setLoading] = useState(false)

    const calculateTotal = (type) => {
        let result = 0

        keranjang.forEach(item => {
            result += (item.harga * item.qty)
        })

        return type === 'disc' ? result - discount : result
    }

    const validateVoucher = useCallback(async () => {
        if (!voucher) {
            setDiscount(0)
            return
        }
        try {
            const res = await fetch(BASE_URL + `/vouchers?kode=${voucher}`)
            const data = await res.json()
            if (data.status_code === 200) {
                setDiscount(data.datas.nominal)
            }
        } catch (error) {
            console.log(JSON.stringify(error))
        }
    }, [voucher])

    const buatPesanan = async () => {
        setLoading(true)
        try {
            const data = {
                nominal_diskon: discount,
                nominal_pesanan: calculateTotal('disc') < 0 ? 0 : calculateTotal('disc'),
                items: keranjang,
            }

            const res = await fetch(BASE_URL + '/order', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (res.status === 200) {
                toast({
                    title: 'Berhasil Membuat Pesanan',
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                })
            }
        } catch (error) {
            console.log(JSON.stringify(error))
        } finally {
            setLoading(false)
            setDiscount(0)
            setVoucher('')
            onClose()
        }
    }

    useEffect(() => {
        validateVoucher()
    }, [validateVoucher])

    return (
        <Drawer
            size="md"
            placement='right'
            finalFocusRef={btnRef}
            onClose={() => {
                setDiscount(0)
                setVoucher('')
                onClose()
            }}
            isOpen={isOpen}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                    Keranjang
                </DrawerHeader>

                <DrawerBody>
                    {
                        keranjang.length
                            ? keranjang.map(item => (
                                <Card key={item.id} mb={4}>
                                    <Card
                                        direction={{ base: 'column', sm: 'row' }}
                                        overflow='hidden'
                                    >
                                        {item?.gambar ? (
                                            <Image
                                                w="32"
                                                p="4"
                                                objectFit='contain'
                                                src={item.gambar}
                                                alt={item.nama}
                                            />
                                        ) : null}

                                        <CardBody>
                                            <Heading size='md'>
                                                {item?.nama}
                                            </Heading>
                                            <Text fontSize='md' fontWeight="semibold" color="teal.300">
                                                Rp {thousandSeparator(item?.harga)}
                                            </Text>
                                            <Input
                                                mt={2}
                                                placeholder="Masukkan catatan disini"
                                                onChange={e => updateItem({
                                                    id: item.id,
                                                    catatan: e.target.value,
                                                })}
                                            />
                                            <Flex
                                                mt={4}
                                                gap={6}
                                                alignItems="center"
                                                justifyContent="end"
                                            >
                                                <Button
                                                    variant='solid'
                                                    colorScheme='teal'
                                                    onClick={item.qty < 2 ? () => removeItem(item.id) : () => decreaseQty(item)}
                                                >
                                                    {item.qty < 2 ? <DeleteIcon /> : <MinusIcon />}
                                                </Button>
                                                <Text fontSize='xl'>{item.qty}</Text>
                                                <Button
                                                    variant='solid'
                                                    colorScheme='teal'
                                                    onClick={() => addItem(item)}
                                                >
                                                    <AddIcon />
                                                </Button>
                                            </Flex>
                                        </CardBody>
                                    </Card>
                                </Card>
                            ))
                            : <Text>Keranjang kamu masih kosong</Text>
                    }
                    <Divider my={6} />
                    <Text>Tambah Voucher</Text>
                    <Input
                        onChange={e => {
                            let debounceFunction = setTimeout(() => {
                                setVoucher(e.target.value.toLowerCase())
                            }, 1000)

                            return () => clearTimeout(debounceFunction)
                        }}
                        placeholder='Masukkan vouchermu disini'
                    />
                </DrawerBody>

                <DrawerFooter flex flexDir="column" gap={4}>
                    <Flex w="full" justifyContent="space-between">
                        <Text fontSize="md">
                            Subtotal
                        </Text>
                        <Text fontSize="md">
                            Rp {thousandSeparator(calculateTotal())}
                        </Text>
                    </Flex>
                    {discount ? (
                        <Flex w="full" justifyContent="space-between">
                            <Text fontWeight="semibold" fontSize="md">
                                Diskon
                            </Text>
                            <Text fontWeight="semibold" fontSize="md" color="teal">
                                Rp {thousandSeparator(discount)}
                            </Text>
                        </Flex>
                    ) : null}
                    <Flex w="full" justifyContent="space-between">
                        <Text fontWeight="semibold" fontSize="lg">
                            Total
                        </Text>
                        <Text fontWeight="semibold" fontSize="lg">
                            Rp {thousandSeparator(calculateTotal('disc') < 0 ? 0 : calculateTotal('disc'))}
                        </Text>
                    </Flex>
                    <Button
                        w="full"
                        colorScheme='teal'
                        isLoading={loading}
                        onClick={buatPesanan}
                        isDisabled={!keranjang.length}
                    >
                        Buat Pesanan
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    keranjang: PropTypes.array,
    addItem: PropTypes.func,
    decreaseQty: PropTypes.func,
    removeItem: PropTypes.func,
    updateItem: PropTypes.func,
}

export default Sidebar;