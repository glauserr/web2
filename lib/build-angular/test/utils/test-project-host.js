"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const child_process_1 = require("child_process");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class TestProjectHost extends node_1.NodeJsSyncHost {
    constructor(_root) {
        super();
        this._root = _root;
        this._scopedSyncHost = new core_1.virtualFs.SyncDelegateHost(new core_1.virtualFs.ScopedHost(this, _root));
    }
    scopedSync() {
        return this._scopedSyncHost;
    }
    initialize() {
        return this.exists(core_1.normalize('.git')).pipe(operators_1.concatMap(exists => !exists ? this._gitInit() : rxjs_1.EMPTY));
    }
    restore() {
        return this._gitClean();
    }
    _gitClean() {
        return this._exec('git', ['clean', '-fd']).pipe(operators_1.concatMap(() => this._exec('git', ['checkout', '.'])), operators_1.map(() => { }));
    }
    _gitInit() {
        return this._exec('git', ['init']).pipe(operators_1.concatMap(() => this._exec('git', ['config', 'user.email', 'angular-core+e2e@google.com'])), operators_1.concatMap(() => this._exec('git', ['config', 'user.name', 'Angular DevKit Tests'])), operators_1.concatMap(() => this._exec('git', ['add', '--all'])), operators_1.concatMap(() => this._exec('git', ['commit', '-am', '"Initial commit"'])), operators_1.map(() => { }));
    }
    _exec(cmd, args) {
        return new rxjs_1.Observable(obs => {
            args = args.filter(x => x !== undefined);
            let stdout = '';
            let stderr = '';
            const spawnOptions = { cwd: core_1.getSystemPath(this._root) };
            if (process.platform.startsWith('win')) {
                args.unshift('/c', cmd);
                cmd = 'cmd.exe';
                spawnOptions['stdio'] = 'pipe';
            }
            const childProcess = child_process_1.spawn(cmd, args, spawnOptions);
            childProcess.stdout.on('data', (data) => stdout += data.toString('utf-8'));
            childProcess.stderr.on('data', (data) => stderr += data.toString('utf-8'));
            // Create the error here so the stack shows who called this function.
            const err = new Error(`Running "${cmd} ${args.join(' ')}" returned error code `);
            childProcess.on('exit', (code) => {
                if (!code) {
                    obs.next({ stdout, stderr });
                }
                else {
                    err.message += `${code}.\n\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}\n`;
                    obs.error(err);
                }
                obs.complete();
            });
        });
    }
    writeMultipleFiles(files) {
        Object.keys(files).map(fileName => {
            let content = files[fileName];
            if (typeof content == 'string') {
                content = core_1.virtualFs.stringToFileBuffer(content);
            }
            else if (content instanceof Buffer) {
                content = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength);
            }
            this.scopedSync().write(core_1.normalize(fileName), content);
        });
    }
    replaceInFile(path, match, replacement) {
        const content = core_1.virtualFs.fileBufferToString(this.scopedSync().read(core_1.normalize(path)));
        this.scopedSync().write(core_1.normalize(path), core_1.virtualFs.stringToFileBuffer(content.replace(match, replacement)));
    }
    appendToFile(path, str) {
        const content = core_1.virtualFs.fileBufferToString(this.scopedSync().read(core_1.normalize(path)));
        this.scopedSync().write(core_1.normalize(path), core_1.virtualFs.stringToFileBuffer(content.concat(str)));
    }
    fileMatchExists(dir, regex) {
        const [fileName] = this.scopedSync().list(core_1.normalize(dir)).filter(name => name.match(regex));
        return fileName || undefined;
    }
    copyFile(from, to) {
        const content = this.scopedSync().read(core_1.normalize(from));
        this.scopedSync().write(core_1.normalize(to), content);
    }
}
exports.TestProjectHost = TestProjectHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1wcm9qZWN0LWhvc3QuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX2FuZ3VsYXIvdGVzdC91dGlscy90ZXN0LXByb2plY3QtaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtDQUs4QjtBQUM5QixvREFBMkQ7QUFDM0QsaURBQW9EO0FBRXBELCtCQUF5QztBQUN6Qyw4Q0FBZ0Q7QUFRaEQscUJBQTZCLFNBQVEscUJBQWM7SUFHakQsWUFBc0IsS0FBVztRQUMvQixLQUFLLEVBQUUsQ0FBQztRQURZLFVBQUssR0FBTCxLQUFLLENBQU07UUFFL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGdCQUFTLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxnQkFBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQsVUFBVTtRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO0lBQzlCLENBQUM7SUFFRCxVQUFVO1FBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDeEMscUJBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQUssQ0FBQyxDQUN2RCxDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU87UUFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFTyxTQUFTO1FBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUM3QyxxQkFBUyxDQUFDLEdBQUcs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QVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRCxDQUFDO0NBQ0Y7QUFqSEQsMENBaUhDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBQYXRoLFxuICBnZXRTeXN0ZW1QYXRoLFxuICBub3JtYWxpemUsXG4gIHZpcnR1YWxGcyxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgTm9kZUpzU3luY0hvc3QgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZS9ub2RlJztcbmltcG9ydCB7IFNwYXduT3B0aW9ucywgc3Bhd24gfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB7IFN0YXRzIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgRU1QVFksIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNvbmNhdE1hcCwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5cbmludGVyZmFjZSBQcm9jZXNzT3V0cHV0IHtcbiAgc3Rkb3V0OiBzdHJpbmc7XG4gIHN0ZGVycjogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgVGVzdFByb2plY3RIb3N0IGV4dGVuZHMgTm9kZUpzU3luY0hvc3Qge1xuICBwcml2YXRlIF9zY29wZWRTeW5jSG9zdDogdmlydHVhbEZzLlN5bmNEZWxlZ2F0ZUhvc3Q8U3RhdHM+O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfcm9vdDogUGF0aCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fc2NvcGVkU3luY0hvc3QgPSBuZXcgdmlydHVhbEZzLlN5bmNEZWxlZ2F0ZUhvc3QobmV3IHZpcnR1YWxGcy5TY29wZWRIb3N0KHRoaXMsIF9yb290KSk7XG4gIH1cblxuICBzY29wZWRTeW5jKCkge1xuICAgIHJldHVybiB0aGlzLl9zY29wZWRTeW5jSG9zdDtcbiAgfVxuXG4gIGluaXRpYWxpemUoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuZXhpc3RzKG5vcm1hbGl6ZSgnLmdpdCcpKS5waXBlKFxuICAgICAgY29uY2F0TWFwKGV4aXN0cyA9PiAhZXhpc3RzID8gdGhpcy5fZ2l0SW5pdCgpIDogRU1QVFkpLFxuICAgICk7XG4gIH1cblxuICByZXN0b3JlKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9naXRDbGVhbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2l0Q2xlYW4oKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2V4ZWMoJ2dpdCcsIFsnY2xlYW4nLCAnLWZkJ10pLnBpcGUoXG4gICAgICBjb25jYXRNYXAoKCkgPT4gdGhpcy5fZXhlYygnZ2l0JywgWydjaGVja291dCcsICcuJ10pKSxcbiAgICAgIG1hcCgoKSA9PiB7IH0pLFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF9naXRJbml0KCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9leGVjKCdnaXQnLCBbJ2luaXQnXSkucGlwZShcbiAgICAgIGNvbmNhdE1hcCgoKSA9PiB0aGlzLl9leGVjKCdnaXQnLCBbJ2NvbmZpZycsICd1c2VyLmVtYWlsJywgJ2FuZ3VsYXItY29yZStlMmVAZ29vZ2xlLmNvbSddKSksXG4gICAgICBjb25jYXRNYXAoKCkgPT4gdGhpcy5fZXhlYygnZ2l0JywgWydjb25maWcnLCAndXNlci5uYW1lJywgJ0FuZ3VsYXIgRGV2S2l0IFRlc3RzJ10pKSxcbiAgICAgIGNvbmNhdE1hcCgoKSA9PiB0aGlzLl9leGVjKCdnaXQnLCBbJ2FkZCcsICctLWFsbCddKSksXG4gICAgICBjb25jYXRNYXAoKCkgPT4gdGhpcy5fZXhlYygnZ2l0JywgWydjb21taXQnLCAnLWFtJywgJ1wiSW5pdGlhbCBjb21taXRcIiddKSksXG4gICAgICBtYXAoKCkgPT4geyB9KSxcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfZXhlYyhjbWQ6IHN0cmluZywgYXJnczogc3RyaW5nW10pOiBPYnNlcnZhYmxlPFByb2Nlc3NPdXRwdXQ+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzID0+IHtcbiAgICAgIGFyZ3MgPSBhcmdzLmZpbHRlcih4ID0+IHggIT09IHVuZGVmaW5lZCk7XG4gICAgICBsZXQgc3Rkb3V0ID0gJyc7XG4gICAgICBsZXQgc3RkZXJyID0gJyc7XG5cbiAgICAgIGNvbnN0IHNwYXduT3B0aW9uczogU3Bhd25PcHRpb25zID0geyBjd2Q6IGdldFN5c3RlbVBhdGgodGhpcy5fcm9vdCkgfTtcblxuICAgICAgaWYgKHByb2Nlc3MucGxhdGZvcm0uc3RhcnRzV2l0aCgnd2luJykpIHtcbiAgICAgICAgYXJncy51bnNoaWZ0KCcvYycsIGNtZCk7XG4gICAgICAgIGNtZCA9ICdjbWQuZXhlJztcbiAgICAgICAgc3Bhd25PcHRpb25zWydzdGRpbyddID0gJ3BpcGUnO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGlsZFByb2Nlc3MgPSBzcGF3bihjbWQsIGFyZ3MsIHNwYXduT3B0aW9ucyk7XG4gICAgICBjaGlsZFByb2Nlc3Muc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGE6IEJ1ZmZlcikgPT4gc3Rkb3V0ICs9IGRhdGEudG9TdHJpbmcoJ3V0Zi04JykpO1xuICAgICAgY2hpbGRQcm9jZXNzLnN0ZGVyci5vbignZGF0YScsIChkYXRhOiBCdWZmZXIpID0+IHN0ZGVyciArPSBkYXRhLnRvU3RyaW5nKCd1dGYtOCcpKTtcblxuICAgICAgLy8gQ3JlYXRlIHRoZSBlcnJvciBoZXJlIHNvIHRoZSBzdGFjayBzaG93cyB3aG8gY2FsbGVkIHRoaXMgZnVuY3Rpb24uXG4gICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoYFJ1bm5pbmcgXCIke2NtZH0gJHthcmdzLmpvaW4oJyAnKX1cIiByZXR1cm5lZCBlcnJvciBjb2RlIGApO1xuXG4gICAgICBjaGlsZFByb2Nlc3Mub24oJ2V4aXQnLCAoY29kZSkgPT4ge1xuICAgICAgICBpZiAoIWNvZGUpIHtcbiAgICAgICAgICBvYnMubmV4dCh7IHN0ZG91dCwgc3RkZXJyIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVyci5tZXNzYWdlICs9IGAke2NvZGV9LlxcblxcblNURE9VVDpcXG4ke3N0ZG91dH1cXG5cXG5TVERFUlI6XFxuJHtzdGRlcnJ9XFxuYDtcbiAgICAgICAgICBvYnMuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBvYnMuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgd3JpdGVNdWx0aXBsZUZpbGVzKGZpbGVzOiB7IFtwYXRoOiBzdHJpbmddOiBzdHJpbmcgfCBBcnJheUJ1ZmZlckxpa2UgfCBCdWZmZXIgfSk6IHZvaWQge1xuICAgIE9iamVjdC5rZXlzKGZpbGVzKS5tYXAoZmlsZU5hbWUgPT4ge1xuICAgICAgbGV0IGNvbnRlbnQgPSBmaWxlc1tmaWxlTmFtZV07XG4gICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29udGVudCA9IHZpcnR1YWxGcy5zdHJpbmdUb0ZpbGVCdWZmZXIoY29udGVudCk7XG4gICAgICB9IGVsc2UgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICAgICAgY29udGVudCA9IGNvbnRlbnQuYnVmZmVyLnNsaWNlKFxuICAgICAgICAgIGNvbnRlbnQuYnl0ZU9mZnNldCxcbiAgICAgICAgICBjb250ZW50LmJ5dGVPZmZzZXQgKyBjb250ZW50LmJ5dGVMZW5ndGgsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2NvcGVkU3luYygpLndyaXRlKFxuICAgICAgICBub3JtYWxpemUoZmlsZU5hbWUpLFxuICAgICAgICBjb250ZW50LFxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlcGxhY2VJbkZpbGUocGF0aDogc3RyaW5nLCBtYXRjaDogUmVnRXhwIHwgc3RyaW5nLCByZXBsYWNlbWVudDogc3RyaW5nKSB7XG4gICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcodGhpcy5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUocGF0aCkpKTtcbiAgICB0aGlzLnNjb3BlZFN5bmMoKS53cml0ZShub3JtYWxpemUocGF0aCksXG4gICAgICB2aXJ0dWFsRnMuc3RyaW5nVG9GaWxlQnVmZmVyKGNvbnRlbnQucmVwbGFjZShtYXRjaCwgcmVwbGFjZW1lbnQpKSk7XG4gIH1cblxuICBhcHBlbmRUb0ZpbGUocGF0aDogc3RyaW5nLCBzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKHRoaXMuc2NvcGVkU3luYygpLnJlYWQobm9ybWFsaXplKHBhdGgpKSk7XG4gICAgdGhpcy5zY29wZWRTeW5jKCkud3JpdGUobm9ybWFsaXplKHBhdGgpLFxuICAgICAgdmlydHVhbEZzLnN0cmluZ1RvRmlsZUJ1ZmZlcihjb250ZW50LmNvbmNhdChzdHIpKSk7XG4gIH1cblxuICBmaWxlTWF0Y2hFeGlzdHMoZGlyOiBzdHJpbmcsIHJlZ2V4OiBSZWdFeHApIHtcbiAgICBjb25zdCBbZmlsZU5hbWVdID0gdGhpcy5zY29wZWRTeW5jKCkubGlzdChub3JtYWxpemUoZGlyKSkuZmlsdGVyKG5hbWUgPT4gbmFtZS5tYXRjaChyZWdleCkpO1xuXG4gICAgcmV0dXJuIGZpbGVOYW1lIHx8IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvcHlGaWxlKGZyb206IHN0cmluZywgdG86IHN0cmluZykge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnNjb3BlZFN5bmMoKS5yZWFkKG5vcm1hbGl6ZShmcm9tKSk7XG4gICAgdGhpcy5zY29wZWRTeW5jKCkud3JpdGUobm9ybWFsaXplKHRvKSwgY29udGVudCk7XG4gIH1cbn1cbiJdfQ==