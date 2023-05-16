"""
This file automatically copies changes from one directory to another. This allow non-typescript
files to be avaiable in the build directory as soon as they are created in the src directory. Yes,
this is hacky, but it works alongside `tsc -w`, so I'm going to use it "temporarily".
"""

import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import shutil
import os

src_path = "src"
dest_path = "build"
skip_copy_exts = ["ts"]

class FileCopyHandler(FileSystemEventHandler):
    def on_created(self, event):
        new_path = self.get_dest_path(event)
        # Check if directory or file
        if event.is_directory:
            if not os.path.exists(new_path):
                os.makedirs(new_path)
        else:
            # Skip unwanted files
            ext = event.src_path.split(".")[-1]
            for skip_ext in skip_copy_exts:
                if ext == skip_ext:
                    return

            if not os.path.exists(event.src_path):
                return

            shutil.copy(event.src_path, new_path)

    def on_deleted(self, event):
        new_path = self.get_dest_path(event)
        if not os.path.exists(new_path):
            return
        if event.is_directory:
            # Only replace the first occurence of src_path
            shutil.rmtree(new_path)
        else:
            os.remove(new_path)

    def on_modified(self, event):
        # Skip directory modifications
        if event.is_directory:
            return

        new_path = self.get_dest_path(event)
        
        if not os.path.exists(new_path):
            return

        shutil.copy(event.src_path, new_path)

    def on_moved(self, event):
        dest_src_path = event.src_path.replace(src_path, dest_path, 1)
        dest_dest_path = event.dest_path.replace(src_path, dest_path, 1)

        if not os.path.exists(dest_src_path):
            return

        shutil.move(dest_src_path, dest_dest_path)

    def get_dest_path(self, event):
        return event.src_path.replace(src_path, dest_path, 1)

if __name__ == "__main__":
    event_handler = FileCopyHandler()
    observer = Observer()
    observer.schedule(event_handler, path=src_path, recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
