
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  BLEPrinter,
} from "react-native-thermal-receipt-printer";
import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const [printers, setPrinters] = useState([]);
  const [currentPrinter, setCurrentPrinter] = useState();
 
  useEffect(() => {
    initPrinter()
  }, []);

  const initPrinter = () =>{
    BLEPrinter.init().then(()=> {
      BLEPrinter.getDeviceList().then(items => {
        setPrinters(items)
        console.log(items)
      });
    });
  }

  // useEffect(()=>{console.log(printers)}, [currentPrinter])
 
  const _connectPrinter = (printer) => {
    //connect printer
    BLEPrinter.connectPrinter(printer.inner_mac_address).then(
      setCurrentPrinter,
      error => console.warn(error))
  }
 
  const printTextTest = () => {
    // currentPrinter && 
    BLEPrinter.printText(`
    <CM>Ayam Perantauan</CM>
    <C>Jl. Gandaria Selatan no. 42</C>
    <C>0818 03704343</C>\n
    <C>Belanja Anda:</C>
    `);
  }
 
  const printBillTest = () => {
    let outletName = 'Ayam Perantauan'
    let outletAddress = 'Jl. Gandaria Selatan no. 42'
    let outletContact = '0818 0370 4343'
    let belanjaan = [
      {nama: 'Ayam Geprek', qty: 2, harga: 5000},
      {nama: 'Ayam Kremes', qty: 1, harga: 9000},
      {nama: 'Ayam Galeyo', qty: 2, harga: 4000},
      {nama: 'Ayam Kampus', qty: 3, harga: 5900},
    ]
    let total = 0
    let items = ``
    belanjaan.map((item)=>{
      let subtotal = item.qty*item.harga
      total = total + subtotal
      items = items + `\r${item.nama} ${item.qty}x${item.harga} = ${item.qty*item.harga}`
    })
    currentPrinter &&  BLEPrinter.printBill(`
    <CM>${outletName}</CM>
    <C>${outletAddress}</C>
    <C>${outletContact}</C>\n
    <C>Belanja Anda:</C>
    ${items}
    <R>Total : ${total}</R>\n
    Terima Kasih!
    `);
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Tes Printer Chatat</Text>
          <View style={styles.body}>
            
            { 
              printers.length > 0 &&
              printers.map((printer, i) => {
                return (
                <TouchableOpacity style={{backgroundColor: '#f7f7f7', paddingVertical: 10, margin: 10, }} key={i} onPress={() => _connectPrinter(printer)}>
                  <Text>{`device_name: ${printer.device_name}, inner_mac_address: ${printer.inner_mac_address}`}</Text>
                </TouchableOpacity>
                )
              })
            }
            <TouchableOpacity onPress={printTextTest}>
              <Text>Print Text</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={printBillTest}>
              <Text>Print Bill Text</Text>
            </TouchableOpacity>
            
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
