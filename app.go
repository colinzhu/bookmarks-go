package main

import (
	"bookmarks/handler"
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"
)

func main() {

	startServer()
}

func startServer() {
	http.Handle("/json-schema-tool/", handler.NewEmbedStaticFileServer())

	port := flag.Int("p", 0, "Port number to use, default is 0 for random")
	flag.Parse()

	listener, err := net.Listen("tcp", fmt.Sprint(":", *port))
	if err != nil {
		panic(err)
	}

	actPort := listener.Addr().(*net.TCPAddr).Port
	log.Printf("Server started at %d", actPort)

	err = http.Serve(listener, nil)
	if err != nil {
		panic(err)
	}
}
