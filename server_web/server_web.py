import socket
import os
import threading

def handle_client(clientsocket):
    try:
        print('S-a conectat un client.')
        cerere = ''
        linieDeStart = ''
        while True:
            buf = clientsocket.recv(1024)
            if len(buf) < 1:
                break
            cerere = cerere + buf.decode()
            print('S-a citit mesajul:\n---------------------------\n' + cerere + '\n---------------------------')
            pozitie = cerere.find('\r\n')
            if (pozitie > -1 and linieDeStart == ''):
                linieDeStart = cerere[0:pozitie]
                print('S-a citit linia de start din cerere: ##### ' + linieDeStart + ' #####')
                break
        print('S-a terminat cititrea.')
        if linieDeStart == '':
            print('S-a terminat comunicarea cu clientul - nu s-a primit niciun mesaj.')
            return
        elementeLineDeStart = linieDeStart.split()
        numeResursaCeruta = elementeLineDeStart[1]
        if numeResursaCeruta == '/':
            numeResursaCeruta = 'index.html'
        
        if numeResursaCeruta[-1] == '?':
            numeResursaCeruta = numeResursaCeruta[0:len(numeResursaCeruta)-1]

        numeFisier = 'continut\\' + numeResursaCeruta
        cale_fisier = os.path.join('E:\\Facultate\\PW\\proiect-1-Raimond-Eduard\\', numeFisier)

        fisier = None
        try:
            fisier = open(cale_fisier, 'rb')
        
            numeExtensie = numeFisier[numeFisier.rfind('.') + 1:]
            tipuriMedia = {
                'html': 'text/html; charset=utf-8',
                'css': 'text/css; charset=utf-',
                'js': 'text/javascript; charset=utf-8',
                'png': 'image/png',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'gif': 'image/gif',
                'ico': 'image/x-icon',
                'xml': 'application/xml; charset=utf-8',
                'json': 'application/json; charset=utf-8'
            }
            tipMedia = tipuriMedia.get(numeExtensie, 'text/plain; charset=utf-8')
        
            clientsocket.sendall(b'HTTP/1.1 200 OK\r\n')
            clientsocket.sendall(('Content-Length: ' + str(os.stat(numeFisier).st_size) + '\r\n').encode())
            clientsocket.sendall(('Content-Type: ' + tipMedia + '\r\n').encode())
            clientsocket.sendall(b'Server: My PW Server\r\n')
            clientsocket.sendall(b'\r\n')
        
            buf = fisier.read(1024)
            while (buf):
                clientsocket.send(buf)
                buf = fisier.read(1024)
        except IOError:
            msg = 'Eroare! Resursa ceruta ' + numeResursaCeruta + ' nu a putut fi gasita!'
            print(msg)
            clientsocket.sendall(b'HTTP/1.1 404 Not Found\r\n')
            clientsocket.sendall(('Content-Length: ' + str(len(msg.encode('utf-8'))) + '\r\n').encode())
            clientsocket.sendall(b'Content-Type: text/plain; charset=utf-8\r\n')
            clientsocket.sendall(b'Server: My PW Server\r\n')
            clientsocket.sendall(b'\r\n')
            clientsocket.sendall(msg.encode())
        
        finally:
            if fisier is not None:
                fisier.close()
        print('S-a terminat comunicarea cu clientul.')
    finally:
        clientsocket.close()

serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serversocket.bind(('', 5678))
serversocket.listen(5)

while True:
    print('#########################################################################')
    print('Serverul asculta potentiali clienti.')
    (clientsocket, address) = serversocket.accept()

    client_handler = threading.Thread(target=handle_client, args=(clientsocket,))
    client_handler.start()
