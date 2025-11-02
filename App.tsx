import React, { useState, useEffect, useRef } from 'react';
import { 
    PROFILE_SUMMARY, 
    EXPERIENCES, 
    PROJECT_CATEGORIES, 
    EDUCATION_HISTORY, 
    CERTIFICATIONS, 
    CONTACT_DETAILS,
    TOOLS_AND_TECH_NODES
} from './constants';
import type { ExperienceItem, ProjectCategory, EducationItem, Certification } from './types';

// Filesystem Node Types
interface FileNode {
    type: 'file';
    content: any;
    formatType?: string;
}
interface DirNode {
    type: 'dir';
    children: { [key: string]: FileNode | DirNode };
}
type FilesystemNode = FileNode | DirNode;
type Filesystem = { [key: string]: DirNode };

// Editor Component Types
interface EditorProps {
    filePath: string;
    initialContent: string;
    onSave: (newContent: string) => void;
    onClose: () => void;
}

const Editor: React.FC<EditorProps> = ({ filePath, initialContent, onSave, onClose }) => {
    const [content, setContent] = useState(initialContent);
    
    const handleSave = () => {
        onSave(content);
    };
    
    return (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="w-full h-full max-w-4xl bg-gray-800 rounded-lg flex flex-col shadow-xl">
                <div className="flex-shrink-0 p-2 bg-gray-700 text-slate-200 font-bold rounded-t-lg">
                    Editing: {filePath}
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-grow p-4 bg-gray-900 text-slate-100 font-mono resize-none border-none outline-none w-full"
                    aria-label={`Editing content for ${filePath}`}
                />
                <div className="flex-shrink-0 p-2 bg-gray-700 flex justify-end space-x-4 rounded-b-lg">
                    <button onClick={handleSave} className="px-4 py-1 bg-green-600 hover:bg-green-500 rounded text-white font-semibold">Save & Exit</button>
                    <button onClick={onClose} className="px-4 py-1 bg-red-600 hover:bg-red-500 rounded text-white font-semibold">Cancel</button>
                </div>
            </div>
        </div>
    );
};


const WelcomeMessage = () => (
    <div>
        <p>Hi, Myself Rohith</p>
        <p>Welcome to my interactive portfolio terminal.</p>
        <p>Type 'help' to see a list of available commands.</p>
        <br />
    </div>
);

const App: React.FC = () => {
    const [history, setHistory] = useState<React.ReactNode[]>([<WelcomeMessage key="welcome" />]);
    const [input, setInput] = useState('');
    const [currentPath, setCurrentPath] = useState('~');
    
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [filesystem, setFilesystem] = useState<Filesystem>({});
    
    const [editorState, setEditorState] = useState<{
        isOpen: boolean;
        filePath: string | null;
        content: string;
    }>({
        isOpen: false,
        filePath: null,
        content: '',
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);

    const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const initializeFilesystem = () => {
        const initialFs: Filesystem = {
            '~': {
                type: 'dir',
                children: {
                    'about': { type: 'file', content: PROFILE_SUMMARY, formatType: 'string' },
                    'experience': {
                        type: 'dir',
                        children: EXPERIENCES.reduce((acc, exp) => {
                            acc[slugify(exp.company)] = { type: 'file', content: exp, formatType: 'experience' };
                            return acc;
                        }, {} as { [key: string]: FileNode })
                    },
                    'projects': {
                        type: 'dir',
                        children: PROJECT_CATEGORIES.reduce((acc, cat) => {
                            acc[slugify(cat.title)] = { type: 'file', content: cat, formatType: 'projectCategory' };
                            return acc;
                        }, {} as { [key: string]: FileNode })
                    },
                    'tools-and-tech-nodes': { type: 'file', content: TOOLS_AND_TECH_NODES, formatType: 'string' },
                    'education': { type: 'file', content: EDUCATION_HISTORY, formatType: 'education_history' },
                    'certifications': { type: 'file', content: CERTIFICATIONS, formatType: 'certifications_list' },
                    'contact': { type: 'file', content: CONTACT_DETAILS, formatType: 'contact' },
                }
            }
        };
        setFilesystem(initialFs);
    };

    useEffect(() => {
        initializeFilesystem();
    }, []);

    useEffect(() => {
        if (!editorState.isOpen) {
            inputRef.current?.focus();
        }
    }, [editorState.isOpen]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const getPrompt = (path: string) => `${isAdminMode ? 'root' : 'guest'}@rohith-portfolio:${path}$`;

    const getNodeFromPath = (path: string, fs: Filesystem): FilesystemNode | null => {
        const parts = path.split('/').filter(p => p !== '' && p !== '.');
        if (parts.length === 0 || parts[0] !== '~') return fs['~'];

        let currentNode: FilesystemNode = fs['~'];
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            if (currentNode.type === 'dir' && currentNode.children[part]) {
                currentNode = currentNode.children[part];
            } else {
                return null;
            }
        }
        return currentNode;
    };
    
    const handleEditorSave = (newContent: string) => {
        if (!editorState.filePath) return;

        const newFs = JSON.parse(JSON.stringify(filesystem));
        const parts = editorState.filePath.split('/').filter(p => p && p !== '.');
        const fileName = parts.pop();
        
        if (!fileName) {
            handleEditorClose();
            return;
        }

        const parentPath = parts.join('/') || '~';
        const parentNode = getNodeFromPath(parentPath, newFs) as DirNode | null;

        if (parentNode?.children[fileName]) {
            const fileNode = parentNode.children[fileName] as FileNode;
            try {
                const parsedContent = JSON.parse(newContent);
                fileNode.content = parsedContent;
            } catch (e) {
                fileNode.content = newContent;
                fileNode.formatType = 'string';
            }
            setFilesystem(newFs);
        }
        
        const successMessage = <p key={history.length} className="text-green-400">Saved changes to {editorState.filePath}</p>;
        setHistory(prev => [...prev, successMessage]);

        handleEditorClose();
    };

    const handleEditorClose = () => {
        setEditorState({ isOpen: false, filePath: null, content: '' });
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleAutocomplete = () => {
        const parts = input.trimStart().split(' ');
        const currentFragment = parts[parts.length - 1];
        
        let potentialCompletions: string[] = [];
        
        if (parts.length === 1) {
            const allCommands = ['help', 'ls', 'll', 'cd', 'cat', 'whoami', 'contact', 'resume', 'clear'];
            potentialCompletions = allCommands.filter(c => c.startsWith(currentFragment));
        } else if (parts.length > 1) {
            const command = parts[0].toLowerCase();
            const currentNode = getNodeFromPath(currentPath, filesystem);
            if (!currentNode || currentNode.type !== 'dir') return;

            let availableArgs: string[] = Object.keys(currentNode.children);

            if (command === 'cd') {
                availableArgs = availableArgs.filter(key => currentNode.children[key].type === 'dir');
            }
            
            potentialCompletions = availableArgs.filter(a => a.startsWith(currentFragment));
        }

        if (potentialCompletions.length === 0) return;

        if (potentialCompletions.length === 1) {
            const completion = potentialCompletions[0];
            const newParts = [...parts.slice(0, -1), completion];
            setInput(newParts.join(' ') + ' ');
        } else {
            let prefix = '';
            const first = potentialCompletions[0];
            for (let i = 0; i < first.length; i++) {
                const char = first[i];
                if (potentialCompletions.every(s => s[i] === char)) {
                    prefix += char;
                } else break;
            }

            if (prefix.length > currentFragment.length) {
                const newParts = [...parts.slice(0, -1), prefix];
                setInput(newParts.join(' '));
            } else {
                const promptLine = <div key={history.length}><span className="text-cyan-400">{getPrompt(currentPath)}</span> {input}</div>;
                const suggestions = <div key={history.length + 1} className="mt-1 mb-2 flex flex-wrap gap-x-4">{potentialCompletions.map(c => <span key={c}>{c}</span>)}</div>;
                setHistory([...history, promptLine, suggestions]);
            }
        }
    };


    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = input.trim();
            const newHistory = [...history, <div key={history.length}><span className="text-cyan-400">{getPrompt(currentPath)}</span> {command}</div>];
            
            if (command) {
                if (command !== commandHistory[commandHistory.length - 1]) {
                    setCommandHistory([...commandHistory, command]);
                }
                setHistoryIndex(commandHistory.length + (command !== commandHistory[commandHistory.length - 1] ? 1 : 0));
                
                const output = processCommand(command);
                if (output) newHistory.push(<div key={history.length + 1}>{output}</div>);
            }

            if (command.toLowerCase() === 'clear') {
                setHistory([<WelcomeMessage key="welcome-clear" />]);
            } else {
                setHistory(newHistory);
            }

            setInput('');
        } else if (e.key === 'Tab') {
            e.preventDefault();
            handleAutocomplete();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const newIndex = Math.max(0, historyIndex - 1);
            if (newIndex < commandHistory.length) {
              setHistoryIndex(newIndex);
              setInput(commandHistory[newIndex] || '');
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newIndex = Math.min(commandHistory.length, historyIndex + 1);
            setHistoryIndex(newIndex);
            setInput(commandHistory[newIndex] || '');
        }
    };

    const processCommand = (command: string): React.ReactNode => {
        const [cmd, ...args] = command.split(' ');
        const argument = args.join(' ');

        if (isAdminMode) {
            switch(cmd.toLowerCase()) {
                case 'mkdir': {
                    const dirName = args[0];
                    if (!dirName) return <p className="text-red-400">mkdir: missing operand</p>;
                    const newFs = JSON.parse(JSON.stringify(filesystem));
                    const currentNode = getNodeFromPath(currentPath, newFs) as DirNode;
                    if (currentNode.children[dirName]) return <p className="text-red-400">mkdir: cannot create directory '{dirName}': File exists</p>;
                    currentNode.children[dirName] = { type: 'dir', children: {} };
                    setFilesystem(newFs);
                    return null;
                }
                case 'touch': {
                     const fileName = args[0];
                    if (!fileName) return <p className="text-red-400">touch: missing file operand</p>;
                    const newFs = JSON.parse(JSON.stringify(filesystem));
                    const currentNode = getNodeFromPath(currentPath, newFs) as DirNode;
                    if (currentNode.children[fileName]) return null; // A simple touch on existing file does nothing
                    currentNode.children[fileName] = { type: 'file', content: '', formatType: 'string' };
                    setFilesystem(newFs);
                    return null;
                }
                case 'echo': {
                    const match = command.match(/^echo\s+"(.*?)"\s+>\s+(\S+)/);
                    if (!match) return <p className="text-red-400">Usage: echo "content" > filename</p>;
                    const [, content, fileName] = match;
                    const newFs = JSON.parse(JSON.stringify(filesystem));
                    const currentNode = getNodeFromPath(currentPath, newFs) as DirNode;
                    const existingFile = currentNode.children[fileName];
                    if (existingFile && existingFile.type === 'dir') return <p className="text-red-400">bash: {fileName}: Is a directory</p>;
                    currentNode.children[fileName] = { type: 'file', content: content, formatType: 'string' };
                    setFilesystem(newFs);
                    return null;
                }
                case 'rm': {
                    if (args[0] === '-rf') {
                        const targetName = args[1];
                        if (!targetName) return <p className="text-red-400">rm: missing operand</p>;
                        const newFs = JSON.parse(JSON.stringify(filesystem));
                        const currentNode = getNodeFromPath(currentPath, newFs) as DirNode;
                        if (!currentNode.children[targetName]) return <p className="text-red-400">rm: cannot remove '{targetName}': No such file or directory</p>;
                        delete currentNode.children[targetName];
                        setFilesystem(newFs);
                        return null;
                    }
                    const fileName = args[0];
                    if (!fileName) return <p className="text-red-400">rm: missing operand</p>;
                    const newFs = JSON.parse(JSON.stringify(filesystem));
                    const currentNode = getNodeFromPath(currentPath, newFs) as DirNode;
                    const targetNode = currentNode.children[fileName];
                    if (!targetNode) return <p className="text-red-400">rm: cannot remove '{fileName}': No such file or directory</p>;
                    if (targetNode.type === 'dir') return <p className="text-red-400">rm: cannot remove '{fileName}': Is a directory</p>;
                    delete currentNode.children[fileName];
                    setFilesystem(newFs);
                    return null;
                }
                case 'rmdir': {
                     const dirName = args[0];
                    if (!dirName) return <p className="text-red-400">rmdir: missing operand</p>;
                    const newFs = JSON.parse(JSON.stringify(filesystem));
                    const currentNode = getNodeFromPath(currentPath, newFs) as DirNode;
                    const targetNode = currentNode.children[dirName];
                     if (!targetNode) return <p className="text-red-400">rmdir: failed to remove '{dirName}': No such file or directory</p>;
                    if (targetNode.type !== 'dir') return <p className="text-red-400">rmdir: failed to remove '{dirName}': Not a directory</p>;
                    if (Object.keys(targetNode.children).length > 0) return <p className="text-red-400">rmdir: failed to remove '{dirName}': Directory not empty</p>;
                    delete currentNode.children[dirName];
                    setFilesystem(newFs);
                    return null;
                }
                case 'gvim': {
                    const fileName = args[0];
                    if (!fileName) return <p className="text-red-400">gvim: missing file operand</p>;
                    const pathToFile = fileName.startsWith('~/') ? fileName : (currentPath === '~' ? `~/${fileName}` : `${currentPath}/${fileName}`);
                    const node = getNodeFromPath(pathToFile, filesystem);
                    if (!node) return <p className="text-red-400">gvim: cannot open '{fileName}': No such file or directory</p>;
                    if (node.type === 'dir') return <p className="text-red-400">gvim: cannot open '{fileName}': Is a directory</p>;
                    
                    const fileContent = typeof node.content === 'string' ? node.content : JSON.stringify(node.content, null, 2);
                    setEditorState({
                        isOpen: true,
                        filePath: pathToFile,
                        content: fileContent,
                    });
                    return null;
                }
            }
        }
        
        switch (cmd.toLowerCase()) {
            case 'admin-edit':
                setIsAdminMode(!isAdminMode);
                return <p className="mt-1 mb-2 text-yellow-400">Admin mode {isAdminMode ? 'disabled' : 'enabled'}.</p>;
            case 'help':
                return (
                    <div className="mt-1 mb-2">
                        <p className="font-bold">Available Commands:</p>
                        <p className="text-sm text-slate-400 italic mb-2">Hint: Use the [Tab] key for auto-completion</p>
                        <ul className="list-disc list-inside ml-2">
                            <li><span className="font-semibold text-green-400">help</span> - Show this help message.</li>
                            <li><span className="font-semibold text-green-400">ls, ll</span> - List directory contents.</li>
                            <li><span className="font-semibold text-green-400">cd [dir]</span> - Change directory. Use 'cd ..' to go back.</li>
                            <li><span className="font-semibold text-green-400">cat [file]</span> - Display content of a file.</li>
                            <li><span className="font-semibold text-green-400">whoami</span> - Display profile summary.</li>
                            <li><span className="font-semibold text-green-400">contact</span> - Show contact information.</li>
                            <li><span className="font-semibold text-green-400">resume</span> - Get a link to download my resume.</li>
                            <li><span className="font-semibold text-green-400">clear</span> - Clear the terminal screen.</li>
                        </ul>
                    </div>
                );
            case 'll':
            case 'ls': {
                const node = getNodeFromPath(currentPath, filesystem);
                if (node && node.type === 'dir') {
                    const entries = Object.entries(node.children).map(([name, childNode]) => (
                        <p key={name} className={childNode.type === 'dir' ? 'text-blue-400' : ''}>
                            {name}{childNode.type === 'dir' ? '/' : ''}
                        </p>
                    ));

                    if (cmd.toLowerCase() === 'll') {
                        // Long format, one per line
                        return <div className="mt-1 mb-2">{entries}</div>;
                    } else {
                        // Short format, wrapped line
                        return <div className="mt-1 mb-2 flex flex-wrap gap-x-4">{entries}</div>;
                    }
                }
                return null;
            }
            case 'cd': {
                const targetDir = args[0];
                if (!targetDir || targetDir === '~') {
                    setCurrentPath('~');
                    return null;
                }
                if (targetDir === '..') {
                    if (currentPath === '~') return null;
                    const newPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
                    setCurrentPath(newPath || '~');
                    return null;
                }
                const newPath = currentPath === '~' ? `~/${targetDir}` : `${currentPath}/${targetDir}`;
                const node = getNodeFromPath(newPath, filesystem);
                if (node && node.type === 'dir') {
                    setCurrentPath(newPath);
                    return null;
                }
                return <p className="mt-1 mb-2 text-red-400">cd: no such file or directory: {targetDir}</p>;
            }
            case 'whoami':
                return <p className="mt-1 mb-2 text-slate-200">{PROFILE_SUMMARY}</p>;
            case 'cat': {
                const fileName = args[0];
                if (!fileName) return <p className="mt-1 mb-2 text-red-400">cat: missing operand</p>;
                const pathToFile = fileName.startsWith('~/') ? fileName : (currentPath === '~' ? `~/${fileName}` : `${currentPath}/${fileName}`);
                const node = getNodeFromPath(pathToFile, filesystem);

                if (!node) return <p className="mt-1 mb-2 text-red-400">cat: {fileName}: No such file or directory</p>;
                if (node.type === 'dir') return <p className="mt-1 mb-2 text-red-400">cat: {fileName}: Is a directory</p>;
                return catFileContent(node);
            }
            case 'contact':
                return catFileContent({ type: 'file', content: CONTACT_DETAILS, formatType: 'contact' });
            case 'resume':
                return (
                    <div className="mt-1 mb-2">
                        <p>You can download my resume here:</p>
                        <a 
                            href="/resume.pdf" 
                            download="Rohith_TM_Resume.pdf"
                            className="text-cyan-400 underline hover:text-cyan-300"
                        >
                           Rohith_TM_Resume.pdf
                        </a>
                    </div>
                );
            case 'clear':
                return null;
            default:
                return <p className="mt-1 mb-2 text-red-400">Command not found: {command}. Type 'help' for a list of commands.</p>;
        }
    };
    
    const catFileContent = (fileNode: FileNode): React.ReactNode => {
        switch (fileNode.formatType) {
            case 'string':
                return <p className="mt-1 mb-2 text-slate-200 whitespace-pre-wrap">{fileNode.content}</p>;
            case 'experience':
                return <div className="mt-1 mb-2 space-y-4">{formatExperience(fileNode.content, 0)}</div>;
            case 'projectCategory':
                return <div className="mt-1 mb-2 space-y-6">{formatProjectCategory(fileNode.content, 0)}</div>;
            case 'education_history':
                 return (
                    <div className="mt-1 mb-2">
                        <h3 className="text-xl font-bold text-cyan-300 mb-2">Education History</h3>
                        <div className="space-y-4 mb-6">
                            {fileNode.content.map((edu: EducationItem, i: number) => formatEducation(edu, i))}
                        </div>
                    </div>
                );
            case 'certifications_list':
                return (
                    <div className="mt-1 mb-2">
                        <h3 className="text-xl font-bold text-cyan-300 mb-2">Certifications</h3>
                        <div className="space-y-2">
                            {fileNode.content.map((cert: Certification, i: number) => formatCertification(cert, i))}
                        </div>
                    </div>
                );
            case 'certification':
                return <div className="mt-1 mb-2">{formatCertification(fileNode.content, 0)}</div>;
            case 'contact':
                return formatContact(fileNode.content);
            default:
                return <p className="mt-1 mb-2 text-slate-200">{JSON.stringify(fileNode.content)}</p>;
        }
    }
    
    const formatExperience = (exp: ExperienceItem, key: number) => (
        <div key={key}>
            <p className="font-bold text-lg text-cyan-300">{exp.role} @ {exp.company}</p>
            <p className="text-sm text-slate-400">{exp.duration}</p>
            <ul className="mt-1 list-disc list-inside text-slate-300 ml-2">
                {exp.points.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
        </div>
    );

    const formatProjectCategory = (category: ProjectCategory, key: number) => (
        <div key={key}>
            <h3 className="text-xl font-bold text-cyan-300">{category.title}</h3>
            {category.meta && <p className="text-sm italic text-slate-400 mb-4">{category.meta}</p>}
            <div className="space-y-3">
                {category.projects.map((proj, i) => (
                    <div key={i}>
                        <h4 className="font-semibold text-slate-100">{proj.title}</h4>
                        <ul className="list-disc list-inside text-slate-300 ml-2">
                            {proj.description.map((desc, di) => <li key={di}>{desc}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
    
    const formatEducation = (edu: EducationItem, key: number) => (
        <div key={key}>
            <p className="font-bold text-lg text-cyan-300">{edu.institution}</p>
            <p className="text-slate-200">{edu.degree} {edu.details && `(${edu.details})`}</p>
            <p className="text-sm text-slate-400">{edu.duration} | Grade: {edu.grade}</p>
        </div>
    );

    const formatCertification = (cert: Certification, key: number) => (
        <p key={key} className="text-slate-200">
            {cert.name} - <span className="text-cyan-400">{cert.issuer}</span> {cert.status && <span className="italic text-slate-400 text-sm">({cert.status})</span>}
        </p>
    );

    const formatContact = (details: typeof CONTACT_DETAILS) => (
        <div className="mt-1 mb-2 space-y-1">
            <p>Email: <a href={`mailto:${details.email}`} className="text-cyan-400 underline">{details.email}</a></p>
            <p>Phone: {details.phone}</p>
            <p>LinkedIn: <a href={`https://${details.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">{details.linkedin}</a></p>
            <p>Location: {details.location}</p>
        </div>
    );

    return (
        <div 
            className="relative p-2 sm:p-4 h-screen w-screen bg-gray-900 text-slate-100 font-mono flex flex-col text-sm sm:text-base"
            onClick={() => !editorState.isOpen && inputRef.current?.focus()}
            aria-label="Interactive Terminal"
        >
            {editorState.isOpen && editorState.filePath && (
                <Editor
                    filePath={editorState.filePath}
                    initialContent={editorState.content}
                    onSave={handleEditorSave}
                    onClose={handleEditorClose}
                />
            )}
            <div className={`flex flex-col h-full ${editorState.isOpen ? 'pointer-events-none' : ''}`}>
                <div className="flex-shrink-0 h-8 bg-gray-700 flex items-center px-4 rounded-t-lg">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-grow text-center text-xs sm:text-sm font-medium text-slate-200">
                        {isAdminMode ? 'root' : 'guest'}@rohith-portfolio -- bash
                    </div>
                </div>
                <div ref={terminalRef} className="flex-grow overflow-y-auto p-2 sm:p-4 bg-black/80 rounded-b-lg" role="log">
                    {history}
                    <div className="flex items-center" role="form">
                        <label htmlFor="command-input" className="sr-only">Command Input</label>
                        <span className="text-cyan-400" aria-hidden="true">{getPrompt(currentPath)}&nbsp;</span>
                        <input
                            id="command-input"
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                            className="flex-grow bg-transparent border-none outline-none text-slate-100"
                            autoFocus
                            autoComplete="off"
                            aria-label="Command line input"
                            disabled={editorState.isOpen}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;