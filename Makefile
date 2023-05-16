# This file is likely unncessary, delete once sure
SRCDIR := src
DESTDIR := build
CHILDDIRS := $(patsubst ./$(SRCDIR)/%,%,$(shell find ./$(SRCDIR) -mindepth 1 -type d))
CPFILES := $(patsubst ./$(SRCDIR)/%,%,$(shell find ./$(SRCDIR) ! -name "*.ts" -type f))
SERVER := build/server/app.js

.PHONY: all compile clean $(CHILDDIRS)

all: compile $(CHILDDIRS) $(CPFILES)
	node $(SERVER)

$(CHILDDIRS):
	mkdir -p $(DESTDIR)/$@

$(CPFILES):
	cp -u $(SRCDIR)/$@ $(DESTDIR)/$@

compile:
	tsc

clean:
	sudo rm $(DESTDIR)/* -rf